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
import { ArrowRight } from "lucide-react";
import { useDashboard } from "@/hooks";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const RecentNotesTable = () => {
  const navigate = useNavigate();
  const { recentNotas } = useDashboard();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Notas Fiscais Recentes</CardTitle>
        <CardDescription>
          Últimas notas fiscais emitidas ou em processamento
        </CardDescription>
      </CardHeader>
      <CardContent>
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