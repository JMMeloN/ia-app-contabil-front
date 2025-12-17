import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { Register, RegisterParams } from '@/domain/usecases/auth/register';
import type { AuthModel } from '@/domain/models/auth-model';

export class RemoteRegister implements Register {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<AuthModel>
  ) {}

  async execute(params: RegisterParams): Promise<AuthModel> {
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
        throw new Error('Erro ao cadastrar usuário');
    }
  }
}
