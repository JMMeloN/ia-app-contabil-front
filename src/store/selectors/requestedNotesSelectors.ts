import { selector } from 'recoil';
import { 
  notasSolicitadasState, 
  filtrosNotasSolicitadasState, 
  anexosNotasState,
  historicoNotasState,
  comentariosNotasState,
  paginacaoNotasState,
  notaSelecionadaState
} from '../atoms/requestedNotesAtoms';
import { NotaFiscalSolicitada, EstatisticasNotas, NotaFiscalStatus } from '@/types';

// Selector para notas filtradas
export const notasFiltradas = selector<NotaFiscalSolicitada[]>({
  key: 'notasFiltradas',
  get: ({ get }) => {
    const notas = get(notasSolicitadasState);
    const filtros = get(filtrosNotasSolicitadasState);

    return notas.filter(nota => {
      // Filtro por cliente
      if (filtros.clienteId && nota.clienteId !== filtros.clienteId) {
        return false;
      }

      // Filtro por status
      if (filtros.status && filtros.status.length > 0 && !filtros.status.includes(nota.status)) {
        return false;
      }

      // Filtro por data
      if (filtros.dataInicial) {
        const dataInicial = new Date(filtros.dataInicial);
        const dataNota = new Date(nota.dataSolicitacao);
        if (dataNota < dataInicial) return false;
      }

      if (filtros.dataFinal) {
        const dataFinal = new Date(filtros.dataFinal);
        const dataNota = new Date(nota.dataSolicitacao);
        if (dataNota > dataFinal) return false;
      }

      // Filtro por prioridade
      if (filtros.prioridade && filtros.prioridade.length > 0 && !filtros.prioridade.includes(nota.prioridade)) {
        return false;
      }

      // Filtro por busca (numero da nota, nome do cliente)
      if (filtros.busca) {
        const termoBusca = filtros.busca.toLowerCase();
        const buscaMatch = 
          nota.numeroNota?.toLowerCase().includes(termoBusca) ||
          nota.clienteNome.toLowerCase().includes(termoBusca) ||
          nota.observacoes?.toLowerCase().includes(termoBusca);
        
        if (!buscaMatch) return false;
      }

      return true;
    });
  },
});

// Selector para notas paginadas
export const notasPaginadas = selector<NotaFiscalSolicitada[]>({
  key: 'notasPaginadas',
  get: ({ get }) => {
    const notasFilt = get(notasFiltradas);
    const paginacao = get(paginacaoNotasState);
    
    const inicio = (paginacao.page - 1) * paginacao.pageSize;
    const fim = inicio + paginacao.pageSize;
    
    return notasFilt.slice(inicio, fim);
  },
});

// Selector para total de páginas
export const totalPaginas = selector<number>({
  key: 'totalPaginas',
  get: ({ get }) => {
    const notasFilt = get(notasFiltradas);
    const paginacao = get(paginacaoNotasState);
    
    return Math.ceil(notasFilt.length / paginacao.pageSize);
  },
});

// Selector para estatísticas das notas
export const estatisticasNotas = selector<EstatisticasNotas>({
  key: 'estatisticasNotas',
  get: ({ get }) => {
    const notas = get(notasSolicitadasState);
    
    const totalSolicitacoes = notas.length;
    
    // Contagem por status
    const porStatus: Record<NotaFiscalStatus, number> = {
      pendente: 0,
      anexado: 0,
      processado: 0,
      cancelado: 0,
    };
    
    notas.forEach(nota => {
      porStatus[nota.status]++;
    });
    
    // Contagem por cliente
    const clienteCount: Record<string, { clienteId: string; clienteNome: string; quantidade: number }> = {};
    
    notas.forEach(nota => {
      if (!clienteCount[nota.clienteId]) {
        clienteCount[nota.clienteId] = {
          clienteId: nota.clienteId,
          clienteNome: nota.clienteNome,
          quantidade: 0,
        };
      }
      clienteCount[nota.clienteId].quantidade++;
    });
    
    const porCliente = Object.values(clienteCount);
    
    // Cálculo de tempo médio de processamento
    const notasProcessadas = notas.filter(nota => nota.status === 'processado');
    let tempoMedioProcessamento = 0;
    
    if (notasProcessadas.length > 0) {
      const tempoTotal = notasProcessadas.reduce((acc, nota) => {
        const dataSolicitacao = new Date(nota.dataSolicitacao);
        const dataAtualizacao = new Date(nota.dataUltimaAtualizacao);
        const diffTime = Math.abs(dataAtualizacao.getTime() - dataSolicitacao.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
      }, 0);
      
      tempoMedioProcessamento = tempoTotal / notasProcessadas.length;
    }
    
    // Percentual de notas processadas
    const percentualProcessadas = totalSolicitacoes > 0 
      ? (porStatus.processado / totalSolicitacoes) * 100 
      : 0;
    
    return {
      totalSolicitacoes,
      porStatus,
      porCliente,
      tempoMedioProcessamento,
      percentualProcessadas,
    };
  },
});

// Selector para anexos da nota selecionada
export const anexosNotaSelecionada = selector({
  key: 'anexosNotaSelecionada',
  get: ({ get }) => {
    const notaSelecionada = get(notaSelecionadaState);
    const anexos = get(anexosNotasState);
    
    if (!notaSelecionada) return [];
    
    return anexos.filter(anexo => anexo.notaId === notaSelecionada.id);
  },
});

// Selector para histórico da nota selecionada
export const historicoNotaSelecionada = selector({
  key: 'historicoNotaSelecionada',
  get: ({ get }) => {
    const notaSelecionada = get(notaSelecionadaState);
    const historico = get(historicoNotasState);
    
    if (!notaSelecionada) return [];
    
    return historico
      .filter(hist => hist.notaId === notaSelecionada.id)
      .sort((a, b) => new Date(b.dataAcao).getTime() - new Date(a.dataAcao).getTime());
  },
});

// Selector para comentários da nota selecionada
export const comentariosNotaSelecionada = selector({
  key: 'comentariosNotaSelecionada',
  get: ({ get }) => {
    const notaSelecionada = get(notaSelecionadaState);
    const comentarios = get(comentariosNotasState);
    
    if (!notaSelecionada) return [];
    
    return comentarios
      .filter(comment => comment.notaId === notaSelecionada.id)
      .sort((a, b) => new Date(a.dataComentario).getTime() - new Date(b.dataComentario).getTime());
  },
});

// Selector para notas por prioridade
export const notasPorPrioridade = selector({
  key: 'notasPorPrioridade',
  get: ({ get }) => {
    const notas = get(notasFiltradas);
    
    return {
      alta: notas.filter(nota => nota.prioridade === 'alta'),
      media: notas.filter(nota => nota.prioridade === 'media'),
      baixa: notas.filter(nota => nota.prioridade === 'baixa'),
    };
  },
});