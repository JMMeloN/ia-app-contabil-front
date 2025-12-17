import { AxiosHttpClient } from '@/infra/http/axios-http-client';
import { API_CONFIG } from '@/main/config/api-config';
import type { HttpClient } from '@/data/protocols/http/http-client';

export class HttpClientFactory {
  private static authenticatedInstance: HttpClient | null = null;
  private static publicInstance: HttpClient | null = null;

  /**
   * Cliente HTTP autenticado - inclui token JWT nas requisições
   */
  static makeAuthenticatedHttpClient(): HttpClient {
    if (!this.authenticatedInstance) {
      this.authenticatedInstance = new AxiosHttpClient(API_CONFIG.baseURL, true);
    }
    return this.authenticatedInstance;
  }

  /**
   * Cliente HTTP público - sem autenticação
   */
  static makePublicHttpClient(): HttpClient {
    if (!this.publicInstance) {
      this.publicInstance = new AxiosHttpClient(API_CONFIG.baseURL, false);
    }
    return this.publicInstance;
  }

  /**
   * Reseta as instâncias (útil para logout)
   */
  static reset(): void {
    this.authenticatedInstance = null;
    this.publicInstance = null;
  }
}
