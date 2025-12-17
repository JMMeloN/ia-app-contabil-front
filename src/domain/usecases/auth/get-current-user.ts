import type { UserModel } from '@/domain/models/auth-model';

export interface GetCurrentUser {
  execute(): Promise<UserModel>;
}
