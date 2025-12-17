import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const stats = [
  {
    title: 'Total de Solicitações',
    value: '45',
    icon: FileText,
    description: 'Todas as solicitações',
    color: 'text-blue-600',
  },
  {
    title: 'Pendentes',
    value: '12',
    icon: Clock,
    description: 'Aguardando processamento',
    color: 'text-yellow-600',
  },
  {
    title: 'Processadas',
    value: '30',
    icon: CheckCircle,
    description: 'Concluídas com sucesso',
    color: 'text-green-600',
  },
  {
    title: 'Canceladas',
    value: '3',
    icon: XCircle,
    description: 'Canceladas pelos usuários',
    color: 'text-red-600',
  },
];

export function OperationalDashboard() {
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
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nota fiscal processada</p>
                  <p className="text-xs text-muted-foreground">
                    Empresa ABC Ltda - R$ 2.500,00
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2h atrás</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova solicitação</p>
                  <p className="text-xs text-muted-foreground">
                    Tech Solutions SA - R$ 3.200,50
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">5h atrás</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Solicitação cancelada</p>
                  <p className="text-xs text-muted-foreground">
                    Consultoria XYZ - R$ 1.800,00
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">1d atrás</span>
              </div>
            </div>
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
                  <span className="font-medium">26.7%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[26.7%] bg-yellow-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processadas</span>
                  <span className="font-medium">66.7%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[66.7%] bg-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Canceladas</span>
                  <span className="font-medium">6.7%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[6.7%] bg-red-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
