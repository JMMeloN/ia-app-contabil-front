import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { GetCurrentUser } from '@/domain/usecases/auth/get-current-user';
import type { UserModel } from '@/domain/models/auth-model';

export class RemoteGetCurrentUser implements GetCurrentUser {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<UserModel>
  ) {}

  async execute(): Promise<UserModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body!;
      case HttpStatusCode.unauthorized:
        throw new Error('Não autenticado');
      default:
        throw new Error('Erro ao buscar usuário');
    }
  }
}
