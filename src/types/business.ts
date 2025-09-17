export interface NotaFiscal {
  id: string;
  numero: string;
  valor_nota: number;
  status: "Emitida" | "Processando" | "Cancelada";
  data_emissao: string;
  razao_social: string;
  cnpj: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  razao_social: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalNotas: number;
  notasEmitidas: number;
  notasProcessando: number;
  totalValue: number;
  companies: number;
}