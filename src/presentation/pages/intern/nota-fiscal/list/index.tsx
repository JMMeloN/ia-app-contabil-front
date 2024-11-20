import { SidebarTrigger } from "@/components/ui/sidebar";

import logo from "../../../../../assets/logotipo-mono.png";
import logoWhite from "../../../../../assets/logo-white.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ListNotes() {
  const navigate = useNavigate()

  return (
    <div className="w-full  ">
      <div className="border-b w-full h-[60px] relative flex items-center justify-center">
        <SidebarTrigger className="absolute top-0 left-0" />
        <div>
          <a
            rel="noreferrer noopener"
            href="/home"
            className="ml-2 gap-2 font-bold text-xl flex"
          >
            <img
              src={logo}
              className="max-w-[40px] h-auto block dark:hidden"
              alt=""
            />
            <img
              src={logoWhite}
              className="max-w-[40px] h-auto hidden dark:block"
              alt=""
            />
            Contabil
          </a>
        </div>
      </div>
      <div className="p-4">
        <div>
          <Card className="overflow-hidden">
            <CardHeader className=" dark:bg-zinc-900">
              <div className="flex justify-between">
             <div>
             <CardTitle className="text-md">Notas solicitadas</CardTitle>
              <CardDescription>
                Nessa área você poderá acompanhar o andamento da emissão de nota
                fiscal.
              </CardDescription>
             </div>

             <Button onClick={() => navigate('/create-note')}>Solcitar nota fiscal</Button>
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
                    <TableHead >Valor da nota</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#INV001</TableCell>
                    <TableCell><Badge className="bg-green-700 hover:bg-green-700">Emitida</Badge></TableCell>
                    <TableCell>23/02/2024</TableCell>
                    <TableCell>23/02/2024</TableCell>
                    <TableCell >$250.00</TableCell>
                    <TableCell className="text-center" >-</TableCell>

                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#INV001</TableCell>
                    <TableCell><Badge className="bg-yellow-700 hover:bg-yellow-700">Processando</Badge></TableCell>
                    <TableCell>23/02/2024</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell >$250.00</TableCell>
                    <TableCell className="text-center" ><Button className="p-0 h-6 w-6 " variant="destructive"><Ban></Ban></Button></TableCell>
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
