import { selector } from 'recoil';
import { notasState, companiesState } from '../atoms/businessAtoms';

export const notasEmitidasSelector = selector({
  key: 'notasEmitidasSelector',
  get: ({ get }) => {
    const notas = get(notasState);
    return notas.filter(nota => nota.status === 'Emitida');
  },
});

export const notasProcessandoSelector = selector({
  key: 'notasProcessandoSelector',
  get: ({ get }) => {
    const notas = get(notasState);
    return notas.filter(nota => nota.status === 'Processando');
  },
});

export const totalValueSelector = selector({
  key: 'totalValueSelector',
  get: ({ get }) => {
    const notas = get(notasState);
    return notas.reduce((total, nota) => total + nota.valor_nota, 0);
  },
});

export const recentNotasSelector = selector({
  key: 'recentNotasSelector',
  get: ({ get }) => {
    const notas = get(notasState);
    return notas
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  },
});

export const dashboardSummarySelector = selector({
  key: 'dashboardSummarySelector',
  get: ({ get }) => {
    const notas = get(notasState);
    const companies = get(companiesState);
    const emitidas = get(notasEmitidasSelector);
    const processando = get(notasProcessandoSelector);
    const totalValue = get(totalValueSelector);
    
    return {
      totalNotas: notas.length,
      notasEmitidas: emitidas.length,
      notasProcessando: processando.length,
      totalValue,
      companies: companies.length,
    };
  },
});