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
import { Label } from '@/components/ui/label';
import { Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';

export function PendingRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: '/requests/all',
        method: 'get',
      });

      if (response.statusCode === 200) {
        // Filtrar apenas as pendentes
        const pendentes = response.body.filter(
          (req: any) => req.status === 'PENDENTE',
        );
        setRequests(pendentes);
      }
    } catch (error) {
      toast.error('Erro ao carregar solicitações', {
        description: 'Não foi possível carregar as solicitações pendentes.',
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
        url: `/upload/${selectedRequest.id}`,
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.statusCode === 200) {
        toast.success('Solicitação processada com sucesso!', {
          description:
            'A nota fiscal foi enviada e o status foi atualizado para Processada.',
        });
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setSelectedRequest(null);
        fetchRequests(); // Recarregar lista
      } else {
        toast.error('Erro ao processar solicitação', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao processar solicitação', {
        description:
          error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitações Pendentes</h1>
        <p className="text-muted-foreground">
          Solicitações aguardando processamento
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pendentes ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando solicitações pendentes...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma solicitação pendente no momento
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Emissão</TableHead>
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
                                <p className="text-sm">
                                  {formatCurrency(request.valor)}
                                </p>
                              </div>
                              <div>
                                <Label>Data de Emissão</Label>
                                <p className="text-sm">
                                  {formatDate(request.dataEmissao)}
                                </p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge variant="secondary">Pendente</Badge>
                              </div>
                              {request.observacoes && (
                                <div>
                                  <Label>Observações</Label>
                                  <p className="text-sm">
                                    {request.observacoes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Upload de arquivo */}
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setUploadDialogOpen(true);
                          }}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Processar
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
            <DialogTitle>Processar Solicitação</DialogTitle>
            <DialogDescription>
              Faça upload do arquivo PDF da nota fiscal emitida
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">
                  {selectedRequest.empresaNome}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor: {formatCurrency(selectedRequest.valor)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Data de Emissão: {formatDate(selectedRequest.dataEmissao)}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="file">Arquivo PDF da Nota Fiscal *</Label>
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
              Processar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
