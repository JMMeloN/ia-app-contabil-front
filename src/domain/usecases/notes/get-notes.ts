import type { NotaFiscal } from '@/types';

export interface GetNotes {
  execute(): Promise<NotaFiscal[]>;
}
