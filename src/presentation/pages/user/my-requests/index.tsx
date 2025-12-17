import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '@/presentation/routes/route-paths';
import { useState, useEffect } from 'react';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_CONFIG } from '@/main/config/api-config';
import { toast } from 'sonner';

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

export function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: '/requests',
        method: 'get',
      });

      if (response.statusCode === 200) {
        setRequests(response.body);
      }
    } catch (error) {
      toast.error('Erro ao carregar solicitações', {
        description: 'Não foi possível carregar suas solicitações.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) return;

    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: `/requests/${requestId}`,
        method: 'delete',
      });

      if (response.statusCode === 200) {
        toast.success('Solicitação cancelada com sucesso!');
        fetchRequests(); // Recarregar lista
      } else {
        toast.error('Erro ao cancelar solicitação', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao cancelar solicitação', {
        description:
          error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Solicitações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas solicitações de notas fiscais
          </p>
        </div>
        <Button onClick={() => navigate(USER_ROUTES.NEW_REQUEST)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando solicitações...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma solicitação encontrada. Clique em "Nova Solicitação" para
              começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
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
                    <TableCell>{formatCurrency(request.valor)}</TableCell>
                    <TableCell>{formatDate(request.dataEmissao)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          statusConfig[
                            request.status as keyof typeof statusConfig
                          ].variant
                        }
                      >
                        {
                          statusConfig[
                            request.status as keyof typeof statusConfig
                          ].label
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {request.status === 'PROCESSADA' &&
                          request.arquivoUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(request.arquivoUrl)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        {request.status === 'PENDENTE' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancel(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
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
