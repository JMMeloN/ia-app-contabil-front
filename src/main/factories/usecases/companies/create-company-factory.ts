import { RemoteCreateCompany } from '@/data/usecases/companies/remote-create-company';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { CreateCompany } from '@/domain/usecases/companies/create-company';

export const makeCreateCompany = (): CreateCompany => {
  const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
  return new RemoteCreateCompany(API_ENDPOINTS.companies.base, httpClient);
};
