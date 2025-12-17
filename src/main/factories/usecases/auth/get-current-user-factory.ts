import { RemoteGetCurrentUser } from '@/data/usecases/auth/remote-get-current-user';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { GetCurrentUser } from '@/domain/usecases/auth/get-current-user';

export const makeGetCurrentUser = (): GetCurrentUser => {
  const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
  return new RemoteGetCurrentUser(API_ENDPOINTS.auth.me, httpClient);
};
