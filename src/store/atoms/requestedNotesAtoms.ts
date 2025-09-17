import { atom } from 'recoil';
import { 
  NotaFiscalSolicitada, 
  AnexoNota, 
  HistoricoNota, 
  ComentarioNota, 
  FiltrosNotasSolicitadas,
  NotificacaoNota 
} from '@/types';

// Estados das notas fiscais solicitadas
export const notasSolicitadasState = atom<NotaFiscalSolicitada[]>({
  key: 'notasSolicitadasState',
  default: [],
});

export const notasSolicitadasLoadingState = atom<boolean>({
  key: 'notasSolicitadasLoadingState',
  default: false,
});

// Estado dos anexos
export const anexosNotasState = atom<AnexoNota[]>({
  key: 'anexosNotasState',
  default: [],
});

export const anexosLoadingState = atom<boolean>({
  key: 'anexosLoadingState',
  default: false,
});

// Estado do histórico
export const historicoNotasState = atom<HistoricoNota[]>({
  key: 'historicoNotasState',
  default: [],
});

// Estado dos comentários
export const comentariosNotasState = atom<ComentarioNota[]>({
  key: 'comentariosNotasState',
  default: [],
});

// Estado dos filtros
export const filtrosNotasSolicitadasState = atom<FiltrosNotasSolicitadas>({
  key: 'filtrosNotasSolicitadasState',
  default: {},
});

// Estado da nota selecionada para detalhamento
export const notaSelecionadaState = atom<NotaFiscalSolicitada | null>({
  key: 'notaSelecionadaState',
  default: null,
});

// Estado das notificações
export const notificacoesState = atom<NotificacaoNota[]>({
  key: 'notificacoesState',
  default: [],
});

// Estado do modal de detalhes
export const modalDetalhesAbertoState = atom<boolean>({
  key: 'modalDetalhesAbertoState',
  default: false,
});

// Estados de upload
export const uploadingAttachmentState = atom<boolean>({
  key: 'uploadingAttachmentState',
  default: false,
});

// Estado de paginação
export const paginacaoNotasState = atom<{
  page: number;
  pageSize: number;
  total: number;
}>({
  key: 'paginacaoNotasState',
  default: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
});