import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';

const statusConfig = {
  PENDENTE: {
    label: 'Pendente',
    variant: 'secondary' as const,
  },
  PROCESSADA: {
    label: 'Processada',
    variant: 'default' as const,
  },
  CANCELADA: {
    label: 'Cancelada',
    variant: 'destructive' as const,
  },
};

export function AllRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: 'http://localhost:3333/requests/all',
        method: 'get',
      });

      if (response.statusCode === 200) {
        setRequests(response.body);
      }
    } catch (error) {
      toast.error('Erro ao carregar solicitações', {
        description: 'Não foi possível carregar as solicitações.',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedRequest) return;

    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await httpClient.request({
        url: `http://localhost:3333/upload/${selectedRequest.id}`,
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.statusCode === 200) {
        toast.success('Arquivo enviado com sucesso!', {
          description: 'A nota fiscal foi anexada à solicitação.',
        });
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setSelectedRequest(null);
        fetchRequests(); // Recarregar lista
      } else {
        toast.error('Erro ao enviar arquivo', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao enviar arquivo', {
        description: error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || !selectedRequest) return;

    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();

      const response = await httpClient.request({
        url: `http://localhost:3333/requests/${selectedRequest.id}/status`,
        method: 'patch',
        body: {
          status: newStatus,
        },
      });

      if (response.statusCode === 200) {
        toast.success('Status atualizado com sucesso!', {
          description: `O status da solicitação foi alterado.`,
        });
        setStatusDialogOpen(false);
        setNewStatus('');
        setSelectedRequest(null);
        fetchRequests(); // Recarregar lista
      } else {
        toast.error('Erro ao alterar status', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao alterar status', {
        description: error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Todas as Solicitações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as solicitações de notas fiscais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando solicitações...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma solicitação encontrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Solicitado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.empresa?.nome || 'N/A'}
                  </TableCell>
                  <TableCell>{request.usuario?.name || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(request.valor)}</TableCell>
                  <TableCell>{formatDate(request.dataEmissao)}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[request.status as keyof typeof statusConfig].variant}>
                      {statusConfig[request.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(request.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Visualizar detalhes */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes da Solicitação</DialogTitle>
                            <DialogDescription>
                              Informações completas da solicitação
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Empresa</Label>
                              <p className="text-sm">{request.empresaNome}</p>
                            </div>
                            <div>
                              <Label>Usuário</Label>
                              <p className="text-sm">{request.usuarioNome}</p>
                            </div>
                            <div>
                              <Label>Valor</Label>
                              <p className="text-sm">{formatCurrency(request.valor)}</p>
                            </div>
                            <div>
                              <Label>Data de Emissão</Label>
                              <p className="text-sm">{formatDate(request.dataEmissao)}</p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Badge variant={statusConfig[request.status as keyof typeof statusConfig].variant}>
                                {statusConfig[request.status as keyof typeof statusConfig].label}
                              </Badge>
                            </div>
                            {request.observacoes && (
                              <div>
                                <Label>Observações</Label>
                                <p className="text-sm">{request.observacoes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Upload de arquivo */}
                      {request.status === 'PENDENTE' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setUploadDialogOpen(true);
                          }}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Alterar status */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setStatusDialogOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Upload */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anexar Nota Fiscal</DialogTitle>
            <DialogDescription>
              Faça upload do arquivo PDF da nota fiscal emitida
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Arquivo PDF *</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Arquivo selecionado: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setSelectedFile(null);
                setSelectedRequest(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Arquivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Alteração de Status */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status</DialogTitle>
            <DialogDescription>
              Altere o status da solicitação
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Novo Status *</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="PROCESSADA">Processada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusDialogOpen(false);
                setNewStatus('');
                setSelectedRequest(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleStatusChange} disabled={!newStatus}>
              Alterar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
