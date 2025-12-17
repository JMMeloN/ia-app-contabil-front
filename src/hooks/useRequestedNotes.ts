import type { NotaFiscalSolicitada, AnexoNota, HistoricoNota, ComentarioNota } from '@/types';

// TODO: Implementar quando o backend estiver pronto
export const useRequestedNotes = () => {
  return {
    notasSolicitadas: [] as NotaFiscalSolicitada[],
    notasFiltradasValue: [] as NotaFiscalSolicitada[],
    notasPaginadasValue: [] as NotaFiscalSolicitada[],
    notaSelecionada: null,
    estatisticas: {
      total: 0,
      totalSolicitacoes: 0,
      pendente: 0,
      processado: 0,
      anexado: 0,
      cancelado: 0,
      porStatus: {
        pendente: 0,
        processado: 0,
        anexado: 0,
        cancelado: 0,
      },
      percentualProcessadas: 0,
      tempoMedioProcessamento: 0,
      porCliente: [] as any[],
    },
    notasPrioridade: {
      alta: [] as NotaFiscalSolicitada[],
      media: [] as NotaFiscalSolicitada[],
      baixa: [] as NotaFiscalSolicitada[],
    },
    loading: false,
    filtros: {},
    modalAberto: false,
    paginacao: { page: 1, pageSize: 10, total: 0 },
    totalPaginas: 0,
    fetchNotasSolicitadas: async () => {},
    addNotaSolicitada: async () => {},
    updateNotaStatus: async (_notaId: string, _status: any) => {},
    aplicarFiltros: (_filtros: any) => {},
    limparFiltros: () => {},
    changePage: (_page: number) => {},
    changePageSize: (_size: number) => {},
    abrirModal: (_nota: any) => {},
    fecharModal: () => {},
  };
};

export const useRequestedNotesAttachments = () => {
  return {
    anexos: [] as AnexoNota[],
    anexosNotaSelecionada: [] as AnexoNota[],
    loading: false,
    uploading: false,
    fetchAnexos: async (_notaId: string) => {},
    addAnexo: async (_anexo: any) => {},
    removeAnexo: async (_anexoId: string) => {},
  };
};

export const useRequestedNotesHistory = () => {
  return {
    historico: [] as HistoricoNota[],
    comentarios: [] as ComentarioNota[],
    historicoNotaSelecionada: [] as HistoricoNota[],
    comentariosNotaSelecionada: [] as ComentarioNota[],
    fetchHistorico: async (_notaId: string) => {},
    fetchComentarios: async (_notaId: string) => {},
    addComentario: async (_comentario: any) => {},
  };
};
