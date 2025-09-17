import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useDashboard } from "@/hooks";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const StatsCards = () => {
  const { summary } = useDashboard();

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total de Notas Fiscais</CardDescription>
          <CardTitle className="text-2xl">{summary.totalNotas}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText size={16} className="mr-1" />
            Documentos fiscais emitidos
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Status: Emitidas</CardDescription>
          <CardTitle className="text-2xl">{summary.notasEmitidas}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-green-500">
            <CheckCircle size={16} className="mr-1" />
            Notas fiscais já emitidas
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Status: Em Processamento</CardDescription>
          <CardTitle className="text-2xl">{summary.notasProcessando}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-yellow-500">
            <Clock size={16} className="mr-1" />
            Aguardando processamento
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Valor Total Movimentado</CardDescription>
          <CardTitle className="text-2xl">{formatCurrency(summary.totalValue)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp size={16} className="mr-1" />
            Valor total de notas emitidas
          </div>
        </CardContent>
      </Card>
    </div>
  );
};