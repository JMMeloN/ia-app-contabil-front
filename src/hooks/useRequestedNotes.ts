import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import {
  notasSolicitadasState,
  notasSolicitadasLoadingState,
  anexosNotasState,
  anexosLoadingState,
  historicoNotasState,
  comentariosNotasState,
  filtrosNotasSolicitadasState,
  notaSelecionadaState,
  modalDetalhesAbertoState,
  uploadingAttachmentState,
  paginacaoNotasState,
  notasFiltradas,
  notasPaginadas,
  totalPaginas,
  estatisticasNotas,
  anexosNotaSelecionada,
  historicoNotaSelecionada,
  comentariosNotaSelecionada,
  notasPorPrioridade,
} from '@/store';
import { 
  NotaFiscalSolicitada, 
  AnexoNota, 
  HistoricoNota, 
  ComentarioNota, 
  FiltrosNotasSolicitadas,
  NotaFiscalStatus
} from '@/types';

export const useRequestedNotes = () => {
  const [notasSolicitadas, setNotasSolicitadas] = useRecoilState(notasSolicitadasState);
  const [loading, setLoading] = useRecoilState(notasSolicitadasLoadingState);
  const [filtros, setFiltros] = useRecoilState(filtrosNotasSolicitadasState);
  const [notaSelecionada, setNotaSelecionada] = useRecoilState(notaSelecionadaState);
  const [modalAberto, setModalAberto] = useRecoilState(modalDetalhesAbertoState);
  const [paginacao, setPaginacao] = useRecoilState(paginacaoNotasState);
  
  // Derived state
  const notasFiltradasValue = useRecoilValue(notasFiltradas);
  const notasPaginadasValue = useRecoilValue(notasPaginadas);
  const totalPaginasValue = useRecoilValue(totalPaginas);
  const estatisticas = useRecoilValue(estatisticasNotas);
  const notasPrioridade = useRecoilValue(notasPorPrioridade);

  // Fetch todas as notas solicitadas (usando dados reais da coleção notes)
  const fetchNotasSolicitadas = useCallback(async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const notasRef = collection(db, `users/${auth.currentUser.uid}/notes`);
      const q = query(notasRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      const notasData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Mapear dados reais para interface RequestedNotes
        const mappedData: NotaFiscalSolicitada = {
          id: doc.id,
          clienteId: data.empresa_id || doc.id,
          clienteNome: data.razao_social || 'Cliente não informado',
          clienteEmail: data.email || '',
          numeroNota: doc.id.slice(-8).toUpperCase(),
          valor: Number(data.valor_nota || data.valor_liquido || 0),
          observacoes: data.observacoes || '',
          
          // Mapear status (converter de 'Emitida'/'Processando' para nossos valores)
          status: data.status === 'Emitida' ? 'processado' : 
                  data.status === 'Processando' ? 'pendente' : 'pendente',
          
          prioridade: 'media', // Valor padrão
          
          // Datas
          dataSolicitacao: data.created_at?.toDate?.()?.toISOString() || 
                          (data.created_at instanceof Date ? data.created_at.toISOString() : 
                           new Date().toISOString()),
          dataUltimaAtualizacao: data.updated_at?.toDate?.()?.toISOString() || 
                                data.created_at?.toDate?.()?.toISOString() || 
                                new Date().toISOString(),
          
          // Campos obrigatórios da interface
          createdAt: data.created_at?.toDate?.()?.toISOString() || 
                    (data.created_at instanceof Date ? data.created_at.toISOString() : 
                     new Date().toISOString()),
          updatedAt: data.updated_at?.toDate?.()?.toISOString() || 
                    data.created_at?.toDate?.()?.toISOString() || 
                    new Date().toISOString(),
        };
        
        return mappedData;
      });
      
      setNotasSolicitadas(notasData);
      
      // Update pagination total
      setPaginacao(prev => ({ ...prev, total: notasData.length }));
      
    } catch (error) {
      console.error('Erro ao buscar notas solicitadas:', error);
    } finally {
      setLoading(false);
    }
  }, [setNotasSolicitadas, setLoading, setPaginacao]);

  // Adicionar nova nota solicitada
  const addNotaSolicitada = useCallback(async (notaData: Omit<NotaFiscalSolicitada, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!auth.currentUser) return;

    try {
      const notasRef = collection(db, `users/${auth.currentUser.uid}/requested_notes`);
      const newNota = {
        ...notaData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(notasRef, newNota);
      
      const novaNota: NotaFiscalSolicitada = {
        id: docRef.id,
        ...newNota,
      };
      
      setNotasSolicitadas(prev => [novaNota, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar nota solicitada:', error);
      throw error;
    }
  }, [setNotasSolicitadas]);

  // Atualizar status da nota (na coleção notes real)
  const updateNotaStatus = useCallback(async (notaId: string, novoStatus: NotaFiscalStatus) => {
    if (!auth.currentUser) return;

    try {
      const notaRef = doc(db, `users/${auth.currentUser.uid}/notes`, notaId);
      const dataAtualizacao = new Date();
      
      // Mapear status da nossa interface para o formato original
      const statusOriginal = novoStatus === 'processado' ? 'Emitida' : 
                            novoStatus === 'anexado' ? 'Processando' :
                            novoStatus === 'pendente' ? 'Processando' : 'Processando';
      
      await updateDoc(notaRef, {
        status: statusOriginal,
        updated_at: dataAtualizacao,
      });
      
      // Update local state
      setNotasSolicitadas(prev => 
        prev.map(nota => 
          nota.id === notaId 
            ? { ...nota, status: novoStatus, dataUltimaAtualizacao: dataAtualizacao.toISOString() }
            : nota
        )
      );
      
      // Add to history
      await addHistoricoEntry({
        notaId,
        tipo: 'status_change',
        descricao: `Status alterado para: ${novoStatus}`,
        statusNovo: novoStatus,
        realizadoPor: auth.currentUser.uid,
        realizadoPorNome: auth.currentUser.displayName || 'Usuário',
        dataAcao: dataAtualizacao.toISOString(),
      });
      
    } catch (error) {
      console.error('Erro ao atualizar status da nota:', error);
      throw error;
    }
  }, [setNotasSolicitadas]);

  // Add history entry
  const addHistoricoEntry = useCallback(async (historico: Omit<HistoricoNota, 'id'>) => {
    if (!auth.currentUser) return;

    try {
      const historicoRef = collection(db, `users/${auth.currentUser.uid}/notes_history`);
      await addDoc(historicoRef, historico);
    } catch (error) {
      console.error('Erro ao adicionar entrada do histórico:', error);
    }
  }, []);

  // Apply filters
  const aplicarFiltros = useCallback((novosFiltros: FiltrosNotasSolicitadas) => {
    setFiltros(novosFiltros);
    setPaginacao(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, [setFiltros, setPaginacao]);

  // Clear filters
  const limparFiltros = useCallback(() => {
    setFiltros({});
    setPaginacao(prev => ({ ...prev, page: 1 }));
  }, [setFiltros, setPaginacao]);

  // Pagination
  const changePage = useCallback((page: number) => {
    setPaginacao(prev => ({ ...prev, page }));
  }, [setPaginacao]);

  const changePageSize = useCallback((pageSize: number) => {
    setPaginacao(prev => ({ ...prev, pageSize, page: 1 }));
  }, [setPaginacao]);

  // Modal management
  const abrirModal = useCallback((nota: NotaFiscalSolicitada) => {
    setNotaSelecionada(nota);
    setModalAberto(true);
  }, [setNotaSelecionada, setModalAberto]);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setNotaSelecionada(null);
  }, [setModalAberto, setNotaSelecionada]);

  return {
    // Data
    notasSolicitadas,
    notasFiltradasValue,
    notasPaginadasValue,
    notaSelecionada,
    estatisticas,
    notasPrioridade,
    
    // State
    loading,
    filtros,
    modalAberto,
    paginacao,
    totalPaginas: totalPaginasValue,
    
    // Actions
    fetchNotasSolicitadas,
    addNotaSolicitada,
    updateNotaStatus,
    aplicarFiltros,
    limparFiltros,
    changePage,
    changePageSize,
    abrirModal,
    fecharModal,
  };
};

export const useRequestedNotesAttachments = () => {
  const [anexos, setAnexos] = useRecoilState(anexosNotasState);
  const [loading, setLoading] = useRecoilState(anexosLoadingState);
  const [uploading, setUploading] = useRecoilState(uploadingAttachmentState);
  const anexosNotaSelecionadaValue = useRecoilValue(anexosNotaSelecionada);

  // Fetch attachments for a specific note
  const fetchAnexos = useCallback(async (notaId: string) => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const anexosRef = collection(db, `users/${auth.currentUser.uid}/note_attachments`);
      const q = query(anexosRef, where('notaId', '==', notaId), orderBy('dataUpload', 'desc'));
      const snapshot = await getDocs(q);
      
      const anexosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as AnexoNota[];
      
      setAnexos(anexosData);
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
    } finally {
      setLoading(false);
    }
  }, [setAnexos, setLoading]);

  // Add attachment (without actual file upload for now)
  const addAnexo = useCallback(async (anexoData: Omit<AnexoNota, 'id'>) => {
    if (!auth.currentUser) return;

    setUploading(true);
    try {
      const anexosRef = collection(db, `users/${auth.currentUser.uid}/note_attachments`);
      const docRef = await addDoc(anexosRef, anexoData);
      
      const novoAnexo: AnexoNota = {
        id: docRef.id,
        ...anexoData,
      };
      
      setAnexos(prev => [novoAnexo, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar anexo:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [setAnexos, setUploading]);

  // Remove attachment
  const removeAnexo = useCallback(async (anexoId: string) => {
    if (!auth.currentUser) return;

    try {
      const anexoRef = doc(db, `users/${auth.currentUser.uid}/note_attachments`, anexoId);
      await deleteDoc(anexoRef);
      
      setAnexos(prev => prev.filter(anexo => anexo.id !== anexoId));
    } catch (error) {
      console.error('Erro ao remover anexo:', error);
      throw error;
    }
  }, [setAnexos]);

  return {
    anexos,
    anexosNotaSelecionada: anexosNotaSelecionadaValue,
    loading,
    uploading,
    fetchAnexos,
    addAnexo,
    removeAnexo,
  };
};

export const useRequestedNotesHistory = () => {
  const [historico, setHistorico] = useRecoilState(historicoNotasState);
  const [comentarios, setComentarios] = useRecoilState(comentariosNotasState);
  const historicoNotaSelecionadaValue = useRecoilValue(historicoNotaSelecionada);
  const comentariosNotaSelecionadaValue = useRecoilValue(comentariosNotaSelecionada);

  // Fetch history for a specific note
  const fetchHistorico = useCallback(async (notaId: string) => {
    if (!auth.currentUser) return;
    
    try {
      const historicoRef = collection(db, `users/${auth.currentUser.uid}/notes_history`);
      const q = query(historicoRef, where('notaId', '==', notaId), orderBy('dataAcao', 'desc'));
      const snapshot = await getDocs(q);
      
      const historicoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as HistoricoNota[];
      
      setHistorico(historicoData);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  }, [setHistorico]);

  // Fetch comments for a specific note
  const fetchComentarios = useCallback(async (notaId: string) => {
    if (!auth.currentUser) return;
    
    try {
      const comentariosRef = collection(db, `users/${auth.currentUser.uid}/note_comments`);
      const q = query(comentariosRef, where('notaId', '==', notaId), orderBy('dataComentario', 'asc'));
      const snapshot = await getDocs(q);
      
      const comentariosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ComentarioNota[];
      
      setComentarios(comentariosData);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  }, [setComentarios]);

  // Add comment
  const addComentario = useCallback(async (comentarioData: Omit<ComentarioNota, 'id'>) => {
    if (!auth.currentUser) return;

    try {
      const comentariosRef = collection(db, `users/${auth.currentUser.uid}/note_comments`);
      const docRef = await addDoc(comentariosRef, comentarioData);
      
      const novoComentario: ComentarioNota = {
        id: docRef.id,
        ...comentarioData,
      };
      
      setComentarios(prev => [...prev, novoComentario]);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }, [setComentarios]);

  return {
    historico,
    comentarios,
    historicoNotaSelecionada: historicoNotaSelecionadaValue,
    comentariosNotaSelecionada: comentariosNotaSelecionadaValue,
    fetchHistorico,
    fetchComentarios,
    addComentario,
  };
};