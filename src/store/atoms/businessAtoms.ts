import { atom } from 'recoil';
import { NotaFiscal, Company, DashboardStats } from '@/types';

export const notasState = atom<NotaFiscal[]>({
  key: 'notasState',
  default: [],
});

export const companiesState = atom<Company[]>({
  key: 'companiesState',
  default: [],
});

export const dashboardStatsState = atom<DashboardStats>({
  key: 'dashboardStatsState',
  default: {
    totalNotas: 0,
    notasEmitidas: 0,
    notasProcessando: 0,
    totalValue: 0,
    companies: 0,
  },
});

export const notasLoadingState = atom<boolean>({
  key: 'notasLoadingState',
  default: false,
});

export const companiesLoadingState = atom<boolean>({
  key: 'companiesLoadingState',
  default: false,
});