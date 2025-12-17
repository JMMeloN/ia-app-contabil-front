import { RemoteLogin } from '@/data/usecases/auth/remote-login';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { Login } from '@/domain/usecases/auth/login';

export const makeLogin = (): Login => {
  const httpClient = HttpClientFactory.makePublicHttpClient();
  return new RemoteLogin(API_ENDPOINTS.auth.login, httpClient);
};
