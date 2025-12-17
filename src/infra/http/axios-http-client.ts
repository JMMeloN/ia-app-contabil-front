import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http/http-client';

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
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authRequired) {
          const token = this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && this.authRequired) {
          // Token expirado - pode implementar refresh token aqui
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // TODO: Implementar quando tiver autenticação
    return localStorage.getItem('access_token');
  }

  private handleUnauthorized(): void {
    // TODO: Implementar logout e redirect para login
    localStorage.removeItem('access_token');
    window.location.href = '/sign-in';
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
