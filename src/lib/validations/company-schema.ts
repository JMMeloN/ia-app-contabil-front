import { z } from 'zod';

// Validação de CNPJ
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const companySchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  nomeFantasia: z.string().optional(),
  cnpj: z
    .string()
    .regex(cnpjRegex, 'CNPJ inválido. Formato: 00.000.000/0000-00')
    .min(1, 'CNPJ é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  telefone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Formato: (00) 00000-0000'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'UF deve ter 2 caracteres'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido. Formato: 00000-000'),
  
  // Campos fiscais
  dataAbertura: z.string().optional().or(z.literal('')),
  regimeTributario: z.enum(['Isento', 'MicroempreendedorIndividual', 'SimplesNacional', 'LucroPresumido', 'LucroReal']).optional(),
  naturezaJuridica: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  cityServiceCode: z.string().optional(),

  // Campos técnicos avançados
  regimeEspecialTributacao: z.string().optional(),
  numeroJuntaComercial: z.string().optional().transform(v => v ? Number(v.replace(/\D/g, '')) : undefined),
  rpsSerie: z.string().optional(),
  rpsNumero: z.string().optional().transform(v => v ? Number(v.replace(/\D/g, '')) : undefined),
  aliquotaIss: z.string().optional().transform(v => v ? parseFloat(v.replace(',', '.')) : undefined),
  determinacaoImpostoFederal: z.string().optional(),
  determinacaoImpostoMunicipal: z.string().optional(),
  prefeituraLogin: z.string().optional(),
  prefeituraSenha: z.string().optional(),
  valorAutorizacao: z.string().optional(),

  // Campos de certificado
  certificateFile: z.any().optional(),
  certificatePassword: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
