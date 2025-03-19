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
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

export function ListNotes() {
  const [notas, setNotas] = useState<any[]>([]);
  const usuario = auth.currentUser; // Pega o usuário logado
  const navigate = useNavigate();

  // Buscar as notas do usuário logado
  useEffect(() => {
    const fetchNotas = async () => {
      if (!usuario) {
        return;
      }

      try {
        const notesRef = collection(db, `users/${usuario.uid}/notes`);
        const querySnapshot = await getDocs(query(notesRef));

        const notasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(notasData)
        setNotas(notasData);
      } catch (error) {
        console.error("Erro ao buscar notas: ", error);
      }
    };

    fetchNotas();
  }, [usuario]);

  return (
    <div className="w-full">
      <HeaderIntern />
      <div className="p-4">
        <div>
          <Card className="overflow-hidden">
            <CardHeader className="dark:bg-zinc-900">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-md">Notas solicitadas</CardTitle>
                  <CardDescription>
                    Nessa área você poderá acompanhar o andamento da emissão
                    de nota fiscal.
                  </CardDescription>
                </div>

                <Button onClick={() => navigate("/create-note")}>
                  Solicitar nota fiscal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Valor da nota</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhuma nota solicitada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notas.map((nota) => (
                      <TableRow key={nota.id}>
                        <TableCell className="font-medium">{`#${nota.id}`}</TableCell>
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
                        <TableCell>{nota.descricao}</TableCell>
                        <TableCell>{nota.documento}</TableCell>
                        <TableCell>{`$${nota.valor_nota}`}</TableCell>
                        <TableCell className="text-center">
                          {nota.status === "Processando" && (
                            <Button
                              className="p-0 h-6 w-6"
                              variant="destructive"
                            >
                              <Ban />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
