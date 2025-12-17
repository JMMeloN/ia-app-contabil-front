import type { NotaFiscal } from '@/types';

export type CreateNoteParams = Omit<NotaFiscal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface CreateNote {
  execute(params: CreateNoteParams): Promise<NotaFiscal>;
}
