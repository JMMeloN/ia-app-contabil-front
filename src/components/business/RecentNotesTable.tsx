import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useNotas } from "@/hooks";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const RecentNotesTable = () => {
  const navigate = useNavigate();
  const { recentNotas, loading, error } = useNotas();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Notas Fiscais Recentes</CardTitle>
        <CardDescription>
          Últimas notas fiscais emitidas ou em processamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#ID</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentNotas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhuma nota fiscal emitida ainda.
                  </TableCell>
                </TableRow>
              ) : (
                recentNotas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">
                      {`#${nota.id.substring(0, 6)}`}
                    </TableCell>
                    <TableCell>{nota.razao_social}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          nota.status === "Emitida"
                            ? "bg-green-700 hover:bg-green-700"
                            : "bg-yellow-700 hover:bg-yellow-700"
                        }
                      >
                        {nota.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(nota.valor_nota)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/list-notes")}
          className="gap-1"
        >
          Ver todas as notas
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};