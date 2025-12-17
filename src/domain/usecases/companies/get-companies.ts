import type { Company } from '@/types';

export interface GetCompanies {
  execute(): Promise<Company[]>;
}
