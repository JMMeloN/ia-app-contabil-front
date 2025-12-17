import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { GetNotes } from '@/domain/usecases/notes/get-notes';
import type { NotaFiscal } from '@/types';

export class RemoteGetNotes implements GetNotes {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<NotaFiscal[]>
  ) {}

  async execute(): Promise<NotaFiscal[]> {
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
        throw new Error('Erro ao buscar notas fiscais');
    }
  }
}
