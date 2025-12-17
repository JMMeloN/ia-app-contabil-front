import type { AuthModel } from '@/domain/models/auth-model';

export type RegisterParams = {
  email: string;
  password: string;
  displayName?: string;
};

export interface Register {
  execute(params: RegisterParams): Promise<AuthModel>;
}
