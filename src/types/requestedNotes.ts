export type NotaFiscalStatus = 'pendente' | 'anexado' | 'processado' | 'cancelado';

export interface NotaFiscalSolicitada {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  numeroNota?: string;
  valor: number;
  status: NotaFiscalStatus;
  dataSolicitacao: string;
  dataUltimaAtualizacao: string;
  observacoes?: string;
  tags?: string[];
  prioridade: 'baixa' | 'media' | 'alta';
  createdAt: string;
  updatedAt: string;
}

export interface AnexoNota {
  id: string;
  notaId: string;
  nomeArquivo: string;
  tipoArquivo: 'pdf' | 'xml' | 'image' | 'other';
  tamanhoArquivo: number;
  urlArquivo: string;
  uploadedBy: string;
  uploadedByName: string;
  dataUpload: string;
  versao: number;
  descricao?: string;
}

export interface HistoricoNota {
  id: string;
  notaId: string;
  tipo: 'status_change' | 'attachment_added' | 'attachment_removed' | 'comment_added';
  descricao: string;
  statusAnterior?: NotaFiscalStatus;
  statusNovo?: NotaFiscalStatus;
  anexoId?: string;
  comentario?: string;
  realizadoPor: string;
  realizadoPorNome: string;
  dataAcao: string;
}

export interface ComentarioNota {
  id: string;
  notaId: string;
  autorId: string;
  autorNome: string;
  autorTipo: 'cliente' | 'processador';
  conteudo: string;
  dataComentario: string;
  editado?: boolean;
  dataEdicao?: string;
}

export interface FiltrosNotasSolicitadas {
  clienteId?: string;
  status?: NotaFiscalStatus[];
  dataInicial?: string;
  dataFinal?: string;
  busca?: string;
  prioridade?: ('baixa' | 'media' | 'alta')[];
  temAnexos?: boolean;
}

export interface EstatisticasNotas {
  totalSolicitacoes: number;
  porStatus: Record<NotaFiscalStatus, number>;
  porCliente: Array<{
    clienteId: string;
    clienteNome: string;
    quantidade: number;
  }>;
  tempoMedioProcessamento: number; // em dias
  percentualProcessadas: number;
}

export interface NotificacaoNota {
  id: string;
  notaId: string;
  tipo: 'anexo_adicionado' | 'status_alterado' | 'comentario_adicionado';
  destinatarioId: string;
  remetenteId: string;
  remetenteNome: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  dataNotificacao: string;
}

export interface ExportConfig {
  formato: 'excel' | 'pdf';
  campos: string[];
  filtros: FiltrosNotasSolicitadas;
  incluirAnexos: boolean;
  incluirHistorico: boolean;
}