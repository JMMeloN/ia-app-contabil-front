import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { CreateNote, CreateNoteParams } from '@/domain/usecases/notes/create-note';
import type { NotaFiscal } from '@/types';

export class RemoteCreateNote implements CreateNote {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<NotaFiscal>
  ) {}

  async execute(params: CreateNoteParams): Promise<NotaFiscal> {
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
        throw new Error('Erro ao criar nota fiscal');
    }
  }
}
