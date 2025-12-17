import { RemoteGetCompanies } from '@/data/usecases/companies/remote-get-companies';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { GetCompanies } from '@/domain/usecases/companies/get-companies';

export const makeGetCompanies = (): GetCompanies => {
  const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
  return new RemoteGetCompanies(API_ENDPOINTS.companies.base, httpClient);
};
