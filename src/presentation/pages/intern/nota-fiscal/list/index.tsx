
import { Badge } from "@/components/ui/badge";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { HeaderIntern } from "@/presentation/components/layout-intern/header";

export function ListNotes() {
  const navigate = useNavigate();
  return (
    <div className="w-full  ">

      <HeaderIntern />
      <div className="p-4">
        <div>
          <Card className="overflow-hidden">
            <CardHeader className=" dark:bg-zinc-900">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-md">Notas solicitadas</CardTitle>
                  <CardDescription>
                    Nessa área você poderá acompanhar o andamento da emissão de
                    nota fiscal.
                  </CardDescription>
                </div>

                <Button onClick={() => navigate("/create-note")}>
                  Solcitar nota fiscal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de solicitação</TableHead>
                    <TableHead>Data de emissão</TableHead>
                    <TableHead>Valor da nota</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#INV001</TableCell>
                    <TableCell>
                      <Badge className="bg-green-700 hover:bg-green-700">
                        Emitida
                      </Badge>
                    </TableCell>
                    <TableCell>23/02/2024</TableCell>
                    <TableCell>23/02/2024</TableCell>
                    <TableCell>$250.00</TableCell>
                    <TableCell className="text-center">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#INV001</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-700 hover:bg-yellow-700">
                        Processando
                      </Badge>
                    </TableCell>
                    <TableCell>23/02/2024</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>$250.00</TableCell>
                    <TableCell className="text-center">
                      <Button className="p-0 h-6 w-6 " variant="destructive">
                        <Ban></Ban>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
