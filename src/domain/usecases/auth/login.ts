import type { AuthModel } from '@/domain/models/auth-model';

export type LoginParams = {
  email: string;
  password: string;
};

export interface Login {
  execute(params: LoginParams): Promise<AuthModel>;
}
