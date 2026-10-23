import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http/http-client';
import { clearAuthStorage, isJwtExpired } from '@/infra/auth/jwt-token';
import { getAccessToken, getRefreshToken, refreshAccessToken } from '@/infra/auth/auth-session';

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, private authRequired: boolean = false) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: attach a valid access token, renewing it first if expired.
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (this.authRequired) {
          const token = await this.getValidAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: on 401, refresh once and retry the original request.
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as RetryableConfig | undefined;

        if (error.response?.status === 401 && this.authRequired && config && !config._retried) {
          config._retried = true;

          const newToken = await refreshAccessToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance.request(config);
          }

          this.handleUnauthorized();
        }

        return Promise.reject(error);
      }
    );
  }

  private async getValidAccessToken(): Promise<string | null> {
    const token = getAccessToken();

    if (token && !isJwtExpired(token)) {
      return token;
    }

    // Access token missing or expired: try the refresh token before giving up.
    if (getRefreshToken()) {
      const renewed = await refreshAccessToken();
      if (renewed) {
        return renewed;
      }
    }

    this.handleUnauthorized();
    return null;
  }

  private handleUnauthorized(): void {
    clearAuthStorage();
    if (window.location.pathname !== '/sign-in') {
      window.location.href = '/sign-in';
    }
  }

  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;

    try {
      axiosResponse = await this.axiosInstance.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers,
        params: data.params,
      });

      return {
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          statusCode: error.response.status,
          body: error.response.data,
        };
      }

      throw error;
    }
  }
}
