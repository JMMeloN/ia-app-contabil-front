import { RemoteRegister } from '@/data/usecases/auth/remote-register';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { Register } from '@/domain/usecases/auth/register';

export const makeRegister = (): Register => {
  const httpClient = HttpClientFactory.makePublicHttpClient();
  return new RemoteRegister(API_ENDPOINTS.auth.register, httpClient);
};
