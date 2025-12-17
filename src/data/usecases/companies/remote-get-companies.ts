import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { GetCompanies } from '@/domain/usecases/companies/get-companies';
import type { Company } from '@/types';

export class RemoteGetCompanies implements GetCompanies {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<Company[]>
  ) {}

  async execute(): Promise<Company[]> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body || [];
      case HttpStatusCode.unauthorized:
        throw new Error('Não autorizado');
      default:
        throw new Error('Erro ao buscar empresas');
    }
  }
}
