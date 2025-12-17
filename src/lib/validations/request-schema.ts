import { z } from 'zod';

export const requestSchema = z.object({
  companyId: z.string().min(1, 'Selecione uma empresa'),
  valor: z.coerce
    .number({ invalid_type_error: 'Digite um valor válido' })
    .positive('O valor deve ser maior que zero')
    .min(0.01, 'O valor mínimo é R$ 0,01'),
  dataEmissao: z.string().min(1, 'Selecione a data de emissão'),
  observacoes: z.string().optional(),
});

export type RequestFormData = z.infer<typeof requestSchema>;
