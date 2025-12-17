import type { Company } from '@/types';

export type CreateCompanyParams = Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface CreateCompany {
  execute(params: CreateCompanyParams): Promise<Company>;
}
