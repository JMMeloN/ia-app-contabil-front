import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import { 
  notasState, 
  companiesState, 
  notasLoadingState, 
  companiesLoadingState,
  dashboardSummarySelector,
  recentNotasSelector,
  notasEmitidasSelector,
  notasProcessandoSelector,
  totalValueSelector
} from '@/store';
import { NotaFiscal, Company } from '@/types';

export const useNotas = () => {
  const [notas, setNotas] = useRecoilState(notasState);
  const [loading, setLoading] = useRecoilState(notasLoadingState);
  const recentNotas = useRecoilValue(recentNotasSelector);
  const emitidas = useRecoilValue(notasEmitidasSelector);
  const processando = useRecoilValue(notasProcessandoSelector);
  const totalValue = useRecoilValue(totalValueSelector);

  const fetchNotas = useCallback(async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const notasRef = collection(db, `users/${auth.currentUser.uid}/notes`);
      const q = query(notasRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const notasData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Normalize data for compatibility with legacy documents
          valor_nota: Number(data.valor_nota || 0),
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
          status: data.status || 'Processando',
        };
      }) as NotaFiscal[];
      
      setNotas(notasData);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    } finally {
      setLoading(false);
    }
  }, [setNotas, setLoading]);

  const addNota = async (notaData: Omit<NotaFiscal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!auth.currentUser) return;

    try {
      const notasRef = collection(db, `users/${auth.currentUser.uid}/notes`);
      const newNota = {
        ...notaData,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(notasRef, newNota);
      
      setNotas(prev => [{
        id: docRef.id,
        ...newNota,
      } as NotaFiscal, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      throw error;
    }
  };

  return {
    notas,
    loading,
    recentNotas,
    emitidas,
    processando,
    totalValue,
    fetchNotas,
    addNota,
  };
};

export const useCompanies = () => {
  const [companies, setCompanies] = useRecoilState(companiesState);
  const [companiesLoading, setCompaniesLoading] = useRecoilState(companiesLoadingState);

  const fetchCompanies = useCallback(async () => {
    if (!auth.currentUser) return;
    
    setCompaniesLoading(true);
    try {
      const companiesRef = collection(db, `users/${auth.currentUser.uid}/companies`);
      const q = query(companiesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const companiesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Normalize data for compatibility
          createdAt: data.createdAt || new Date().toISOString(),
        };
      }) as Company[];
      
      setCompanies(companiesData);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setCompaniesLoading(false);
    }
  }, [setCompanies, setCompaniesLoading]);

  const addCompany = async (companyData: Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!auth.currentUser) return;

    try {
      const companiesRef = collection(db, `users/${auth.currentUser.uid}/companies`);
      const newCompany = {
        ...companyData,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(companiesRef, newCompany);
      
      setCompanies(prev => [{
        id: docRef.id,
        ...newCompany,
      } as Company, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      throw error;
    }
  };

  return {
    companies,
    loading: companiesLoading,
    fetchCompanies,
    addCompany,
  };
};

export const useDashboard = () => {
  const summary = useRecoilValue(dashboardSummarySelector);
  const recentNotas = useRecoilValue(recentNotasSelector);
  
  return {
    summary,
    recentNotas,
  };
};