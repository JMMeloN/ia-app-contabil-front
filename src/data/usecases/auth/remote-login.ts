import type { HttpClient } from '@/data/protocols/http/http-client';
import { HttpStatusCode } from '@/data/protocols/http/http-client';
import type { Login, LoginParams } from '@/domain/usecases/auth/login';
import type { AuthModel } from '@/domain/models/auth-model';

export class RemoteLogin implements Login {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<AuthModel>
  ) {}

  async execute(params: LoginParams): Promise<AuthModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body!;
      case HttpStatusCode.unauthorized:
        throw new Error('Credenciais inválidas');
      default:
        throw new Error('Erro ao fazer login');
    }
  }
}
