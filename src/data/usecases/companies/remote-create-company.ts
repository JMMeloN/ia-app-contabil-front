import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { CreateCompany, CreateCompanyParams } from '@/domain/usecases/companies/create-company';
import type { Company } from '@/types';

export class RemoteCreateCompany implements CreateCompany {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<Company>
  ) {}

  async execute(params: CreateCompanyParams): Promise<Company> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created:
      case HttpStatusCode.ok:
        return httpResponse.body!;
      case HttpStatusCode.badRequest:
        throw new Error('Dados inválidos');
      default:
        throw new Error('Erro ao criar empresa');
    }
  }
}
