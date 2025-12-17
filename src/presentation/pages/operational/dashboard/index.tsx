import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { toast } from 'sonner';

export function OperationalDashboard() {
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
      toast.error('Erro ao carregar dashboard', {
        description: 'Não foi possível carregar as estatísticas.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const total = requests.length;
  const pendentes = requests.filter(r => r.status === 'PENDENTE').length;
  const processadas = requests.filter(r => r.status === 'PROCESSADA').length;
  const canceladas = requests.filter(r => r.status === 'CANCELADA').length;

  const stats = [
    {
      title: 'Total de Solicitações',
      value: total.toString(),
      icon: FileText,
      description: 'Todas as solicitações',
      color: 'text-blue-600',
    },
    {
      title: 'Pendentes',
      value: pendentes.toString(),
      icon: Clock,
      description: 'Aguardando processamento',
      color: 'text-yellow-600',
    },
    {
      title: 'Processadas',
      value: processadas.toString(),
      icon: CheckCircle,
      description: 'Concluídas com sucesso',
      color: 'text-green-600',
    },
    {
      title: 'Canceladas',
      value: canceladas.toString(),
      icon: XCircle,
      description: 'Canceladas pelos usuários',
      color: 'text-red-600',
    },
  ];

  // Atividades recentes (últimas 5)
  const recentRequests = requests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d atrás`;
    if (diffHours > 0) return `${diffHours}h atrás`;
    if (diffMins > 0) return `${diffMins}min atrás`;
    return 'agora';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSADA':
        return { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600', label: 'Nota fiscal processada' };
      case 'PENDENTE':
        return { icon: Clock, bg: 'bg-yellow-100', color: 'text-yellow-600', label: 'Nova solicitação' };
      case 'CANCELADA':
        return { icon: XCircle, bg: 'bg-red-100', color: 'text-red-600', label: 'Solicitação cancelada' };
      default:
        return { icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600', label: 'Solicitação' };
    }
  };

  // Calcular percentagens
  const percentPendentes = total > 0 ? ((pendentes / total) * 100).toFixed(1) : '0';
  const percentProcessadas = total > 0 ? ((processadas / total) * 100).toFixed(1) : '0';
  const percentCanceladas = total > 0 ? ((canceladas / total) * 100).toFixed(1) : '0';
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Operacional</h1>
        <p className="text-muted-foreground">
          Visão geral de todas as solicitações de notas fiscais
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando atividades...
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma atividade recente
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => {
                  const statusInfo = getStatusIcon(request.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div key={request.id} className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{statusInfo.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.company?.nome || 'N/A'} - {formatCurrency(request.valor)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(request.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitações por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pendentes</span>
                  <span className="font-medium">{percentPendentes}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-yellow-600" style={{ width: `${percentPendentes}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processadas</span>
                  <span className="font-medium">{percentProcessadas}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-green-600" style={{ width: `${percentProcessadas}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Canceladas</span>
                  <span className="font-medium">{percentCanceladas}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-red-600" style={{ width: `${percentCanceladas}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
