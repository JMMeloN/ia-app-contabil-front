import { useState, useCallback } from 'react';
import type { NotaFiscal, Company } from '@/types';
import { makeGetCompanies } from '@/main/factories/usecases/companies/get-companies-factory';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';

interface RequestFromBackend {
  id: string;
  valor: number;
  dataEmissao: string;
  observacoes?: string;
  status: 'PENDENTE' | 'PROCESSADA' | 'CANCELADA';
  arquivoUrl?: string;
  userId: string;
  companyId: string;
  company?: {
    nome: string;
    cnpj: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Adapter para converter Request do backend para NotaFiscal do frontend
const requestToNotaFiscal = (request: RequestFromBackend): NotaFiscal => {
  const statusMap = {
    PENDENTE: 'Processando' as const,
    PROCESSADA: 'Emitida' as const,
    CANCELADA: 'Cancelada' as const,
  };

  return {
    id: request.id,
    numero: request.id.substring(0, 8).toUpperCase(),
    valor_nota: request.valor,
    status: statusMap[request.status],
    data_emissao: request.dataEmissao,
    razao_social: request.company?.nome || 'Empresa',
    cnpj: request.company?.cnpj || '',
    userId: request.userId,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
};

export const useNotas = () => {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: API_ENDPOINTS.requests.base,
        method: 'get',
      });

      if (response.body) {
        const notasFiscais = (response.body as RequestFromBackend[]).map(requestToNotaFiscal);
        setNotas(notasFiscais);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar notas fiscais');
      console.error('Erro ao buscar notas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNota = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: API_ENDPOINTS.requests.base,
        method: 'post',
        body: data,
      });

      if (response.body) {
        const novaNota = requestToNotaFiscal(response.body as RequestFromBackend);
        setNotas((prev) => [...prev, novaNota]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar nota fiscal');
      console.error('Erro ao criar nota:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const recentNotas = notas.slice(0, 5);
  const emitidas = notas.filter((n) => n.status === 'Emitida').length;
  const processando = notas.filter((n) => n.status === 'Processando').length;
  const totalValue = notas.reduce((sum, n) => sum + n.valor_nota, 0);

  return {
    notas,
    loading,
    error,
    recentNotas,
    emitidas,
    processando,
    totalValue,
    fetchNotas,
    addNota,
  };
};

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const getCompaniesUseCase = makeGetCompanies();
      const result = await getCompaniesUseCase.execute();

      // Adapter para o formato esperado pelo frontend
      const adaptedCompanies = result.map((company: any) => ({
        id: company.id,
        razao_social: company.nome || company.razao_social,
        cnpj: company.cnpj,
        endereco: `${company.endereco}, ${company.cidade} - ${company.estado}`,
        telefone: company.telefone,
        email: company.email,
        userId: company.userId,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      }));

      setCompanies(adaptedCompanies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar empresas');
      console.error('Erro ao buscar empresas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCompany = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: API_ENDPOINTS.companies.base,
        method: 'post',
        body: data,
      });

      if (response.body) {
        const body = response.body as any;
        const novaEmpresa = {
          id: body.id,
          razao_social: body.nome,
          cnpj: body.cnpj,
          endereco: `${body.endereco}, ${body.cidade} - ${body.estado}`,
          telefone: body.telefone,
          email: body.email,
          userId: body.userId,
          createdAt: body.createdAt,
          updatedAt: body.updatedAt,
        };
        setCompanies((prev) => [...prev, novaEmpresa]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
      console.error('Erro ao criar empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    addCompany,
  };
};

export const useDashboard = () => {
  const { notas, emitidas, processando, totalValue, recentNotas } = useNotas();

  return {
    summary: {
      totalNotas: notas.length,
      notasEmitidas: emitidas,
      notasProcessando: processando,
      totalValue: totalValue,
      valorTotal: totalValue,
    },
    recentNotas,
  };
};
