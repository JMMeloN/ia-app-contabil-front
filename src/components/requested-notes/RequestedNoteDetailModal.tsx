import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Calendar,
  User,
  MessageSquare,
  History,
  Paperclip,
  X,
  Edit,
  Mail
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NotaFiscalSolicitada } from '@/types';
import { StatusManager } from './StatusManager';
import { AttachmentsManager } from './AttachmentsManager';
import { useRequestedNotesAttachments, useRequestedNotesHistory } from '@/hooks';

interface RequestedNoteDetailModalProps {
  nota: NotaFiscalSolicitada | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (notaId: string, status: any, observacao?: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendente: { 
      label: 'Pendente', 
      className: 'bg-yellow-100 text-yellow-800' 
    },
    anexado: { 
      label: 'Anexado', 
      className: 'bg-blue-100 text-blue-800' 
    },
    processado: { 
      label: 'Processado', 
      className: 'bg-green-100 text-green-800' 
    },
    cancelado: { 
      label: 'Cancelado', 
      className: 'bg-red-100 text-red-800' 
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge className={config?.className || 'bg-gray-100 text-gray-800'}>
      {config?.label || status}
    </Badge>
  );
};

const getPrioridadeBadge = (prioridade: string) => {
  const prioridadeConfig = {
    baixa: { 
      label: 'Baixa', 
      className: 'bg-gray-100 text-gray-800' 
    },
    media: { 
      label: 'Média', 
      className: 'bg-yellow-100 text-yellow-800' 
    },
    alta: { 
      label: 'Alta', 
      className: 'bg-red-100 text-red-800' 
    },
  };

  const config = prioridadeConfig[prioridade as keyof typeof prioridadeConfig];
  return (
    <Badge variant="outline" className={config?.className || 'bg-gray-100 text-gray-800'}>
      {config?.label || prioridade}
    </Badge>
  );
};

export function RequestedNoteDetailModal({
  nota,
  isOpen,
  onClose,
  onUpdateStatus,
}: RequestedNoteDetailModalProps) {
  const {
    anexosNotaSelecionada,
    fetchAnexos,
    addAnexo,
    removeAnexo,
    uploading,
  } = useRequestedNotesAttachments();

  const {
    historicoNotaSelecionada,
    comentariosNotaSelecionada,
    fetchHistorico,
    fetchComentarios,
  } = useRequestedNotesHistory();

  useEffect(() => {
    if (nota && isOpen) {
      fetchAnexos(nota.id);
      fetchHistorico(nota.id);
      fetchComentarios(nota.id);
    }
  }, [nota, isOpen, fetchAnexos, fetchHistorico, fetchComentarios]);

  if (!nota) return null;

  const handleUploadFile = async (file: File, descricao?: string) => {
    // Simulação de upload - em produção seria um upload real
    const anexoData = {
      notaId: nota.id,
      nomeArquivo: file.name,
      tipoArquivo: file.type.includes('pdf') ? 'pdf' as const : 
                  file.type.includes('xml') ? 'xml' as const :
                  file.type.includes('image') ? 'image' as const : 'other' as const,
      tamanhoArquivo: file.size,
      urlArquivo: URL.createObjectURL(file), // URL temporária
      uploadedBy: 'current-user-id',
      uploadedByName: 'Usuário Atual',
      dataUpload: new Date().toISOString(),
      versao: 1,
      descricao,
    };

    await addAnexo(anexoData);
  };

  const handleDownloadFile = (anexo: any) => {
    // Simular download
    const link = document.createElement('a');
    link.href = anexo.urlArquivo;
    link.download = anexo.nomeArquivo;
    link.click();
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl">
                Detalhes da Solicitação
              </DialogTitle>
              <DialogDescription>
                Solicitação de {nota.clienteNome} • {formatDate(nota.dataSolicitacao)}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Informações principais */}
        <div className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Informações do cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </h3>
              <div className="space-y-3 p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{nota.clienteNome}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {nota.clienteEmail}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações da nota */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações da Nota
              </h3>
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Número:</span>
                  <span className="font-mono text-sm">
                    {nota.numeroNota || 'Não informado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="font-medium">{formatCurrency(nota.valor)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(nota.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prioridade:</span>
                  {getPrioridadeBadge(nota.prioridade)}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {nota.observacoes && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Observações</h3>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm">{nota.observacoes}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Tabs de conteúdo */}
          <Tabs defaultValue="status" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="status" className="gap-2">
                <Edit className="h-4 w-4" />
                Status
              </TabsTrigger>
              <TabsTrigger value="attachments" className="gap-2">
                <Paperclip className="h-4 w-4" />
                Anexos ({anexosNotaSelecionada.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status">
              <StatusManager
                nota={nota}
                onUpdateStatus={onUpdateStatus}
              />
            </TabsContent>

            <TabsContent value="attachments">
              <AttachmentsManager
                anexos={anexosNotaSelecionada}
                onUploadFile={handleUploadFile}
                onRemoveFile={removeAnexo}
                onDownloadFile={handleDownloadFile}
                isUploading={uploading}
                allowEdit={true}
              />
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Histórico de Alterações</h3>
                {historicoNotaSelecionada.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma alteração registrada ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historicoNotaSelecionada.map((item) => (
                      <div key={item.id} className="flex gap-3 p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.descricao}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.dataAcao)}
                            <span>•</span>
                            <User className="h-3 w-3" />
                            {item.realizadoPorNome}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Comentários</h3>
                {comentariosNotaSelecionada.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum comentário ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comentariosNotaSelecionada.map((comentario) => (
                      <div key={comentario.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={comentario.autorTipo === 'cliente' ? 'default' : 'secondary'}>
                              {comentario.autorTipo === 'cliente' ? 'Cliente' : 'Processador'}
                            </Badge>
                            <span className="font-medium text-sm">{comentario.autorNome}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comentario.dataComentario)}
                          </span>
                        </div>
                        <p className="text-sm">{comentario.conteudo}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}