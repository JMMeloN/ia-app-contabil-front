import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/main/config/api-config';
import { Badge } from '@/components/ui/badge';

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Download, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';

export function ProcessedRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Filtrar apenas as processadas
        const processadas = response.body.filter(
          (req: any) => req.status === 'PROCESSADA',
        );
        setRequests(processadas);
      }
    } catch (error) {
      toast.error('Erro ao carregar solicitações', {
        description: 'Não foi possível carregar as solicitações processadas.',
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

  const handleDownload = (arquivoUrl: string) => {
    if (!arquivoUrl) {
      toast.error('Arquivo não disponível');
      return;
    }

    // Fazer download real
    const link = document.createElement('a');
    link.href = `${API_CONFIG.baseURL}${arquivoUrl}`;
    link.download = arquivoUrl.split('/').pop() || 'nota.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Download iniciado!', {
      description: 'O arquivo da nota fiscal está sendo baixado.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitações Processadas</h1>
        <p className="text-muted-foreground">
          Solicitações concluídas com sucesso
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processadas ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando solicitações processadas...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma solicitação processada no momento
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Processado em</TableHead>
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
                      {formatDate(request.updatedAt)}
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
                                Informações completas da solicitação processada
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
                                <Label>Solicitado em</Label>
                                <p className="text-sm">
                                  {formatDate(request.solicitadoEm)}
                                </p>
                              </div>
                              <div>
                                <Label>Processado em</Label>
                                <p className="text-sm">
                                  {formatDate(request.processadoEm)}
                                </p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge variant="default">Processada</Badge>
                              </div>
                              {request.observacoes && (
                                <div>
                                  <Label>Observações</Label>
                                  <p className="text-sm">
                                    {request.observacoes}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label>Arquivo</Label>
                                <div className="mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleDownload(request.arquivoUrl)
                                    }
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    {request.arquivoUrl.split('/').pop()}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Download */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(request.arquivoUrl)}
                        >
                          <Download className="h-4 w-4" />
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
    </div>
  );
}
