import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { toast } from 'sonner';

export function UserDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    processadas: 0,
    canceladas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: '/requests',
        method: 'get',
      });

      if (response.statusCode === 200) {
        const requests = response.body;

        setStats({
          total: requests.length,
          pendentes: requests.filter((r: any) => r.status === 'PENDENTE').length,
          processadas: requests.filter((r: any) => r.status === 'PROCESSADA').length,
          canceladas: requests.filter((r: any) => r.status === 'CANCELADA').length,
        });
      }
    } catch (error) {
      toast.error('Erro ao carregar estatísticas', {
        description: 'Não foi possível carregar as estatísticas do dashboard.',
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total de Solicitações',
      value: loading ? '...' : stats.total.toString(),
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pendentes',
      value: loading ? '...' : stats.pendentes.toString(),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Processadas',
      value: loading ? '...' : stats.processadas.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Canceladas',
      value: loading ? '...' : stats.canceladas.toString(),
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de solicitações de notas fiscais
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Suas solicitações recentes aparecerão aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
