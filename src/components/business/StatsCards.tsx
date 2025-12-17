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
import { useNotas } from "@/hooks";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const SkeletonCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
    </CardContent>
  </Card>
);

export const StatsCards = () => {
  const { loading, emitidas, processando, totalValue, notas } = useNotas();

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const summary = {
    totalNotas: notas.length,
    notasEmitidas: emitidas,
    notasProcessando: processando,
    totalValue: totalValue,
  };

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