/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { HeaderIntern } from "@/presentation/components/layout-intern/header";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  PlusCircle,
  FileText,
  Building,
  TrendingUp,
  FileCheck,
  CheckCircle,
  Clock,
  UserRound,
  ArrowRight,
} from "lucide-react";

interface NotesSummary {
  total: number;
  emitidas: number;
  processando: number;
  recentes: any[];
}

interface CompanySummary {
  total: number;
  recentes: any[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const usuario = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [notesSummary, setNotesSummary] = useState<NotesSummary>({
    total: 0,
    emitidas: 0,
    processando: 0,
    recentes: [],
  });
  const [companySummary, setCompanySummary] = useState<CompanySummary>({
    total: 0,
    recentes: [],
  });
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!usuario) return;

      try {
        setIsLoading(true);
        setUserName(usuario.displayName || "");

        // Buscar resumo das notas
        const notesRef = collection(db, `users/${usuario.uid}/notes`);
        const notesSnapshot = await getDocs(notesRef);
        
        // Contar status das notas
        let emitidas = 0;
        let processando = 0;
        let totalValorNotas = 0;
        
        notesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "Emitida") emitidas++;
          if (data.status === "Processando") processando++;
          
          // Somar valores das notas
          const valorNota = parseFloat(data.valor_nota) || 0;
          totalValorNotas += valorNota;
        });
        
        // Buscar notas recentes
        const recentNotesQuery = query(
          notesRef,
          orderBy("created_at", "desc"),
          limit(5)
        );
        const recentNotesSnapshot = await getDocs(recentNotesQuery);
        const recentNotes = recentNotesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setNotesSummary({
          total: notesSnapshot.size,
          emitidas,
          processando,
          recentes: recentNotes,
        });
        
        setTotalValue(totalValorNotas);

        // Buscar empresas
        const companiesRef = collection(db, `users/${usuario.uid}/companies`);
        const companiesSnapshot = await getDocs(companiesRef);
        
        // Buscar empresas recentes
        const recentCompaniesQuery = query(
          companiesRef,
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const recentCompaniesSnapshot = await getDocs(recentCompaniesQuery);
        const recentCompanies = recentCompaniesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setCompanySummary({
          total: companiesSnapshot.size,
          recentes: recentCompanies,
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [usuario]);

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="w-full">
      <HeaderIntern />
      
      <div className="p-4">
        <div className="flex flex-col gap-6">
          {/* Cabeçalho e boas-vindas */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Olá, {userName}!</h1>
              <p className="text-muted-foreground">
                Bem-vindo ao seu Dashboard de Gerenciamento de Notas Fiscais
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/create-note")} 
                className="gap-2"
              >
                <PlusCircle size={16} />
                Nova Nota Fiscal
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/company-management")}
                className="gap-2"
              >
                <Building size={16} />
                Gerenciar Empresas
              </Button>
            </div>
          </div>
          
          {/* Cards de resumo */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de Notas Fiscais</CardDescription>
                <CardTitle className="text-2xl">{notesSummary.total}</CardTitle>
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
                <CardTitle className="text-2xl">{notesSummary.emitidas}</CardTitle>
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
                <CardTitle className="text-2xl">{notesSummary.processando}</CardTitle>
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
                <CardTitle className="text-2xl">{formatCurrency(totalValue)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp size={16} className="mr-1" />
                  Valor total de notas emitidas
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Notas recentes e Empresas */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Notas recentes */}
            <div className="md:col-span-2">
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
                      {notesSummary.recentes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            Nenhuma nota fiscal emitida ainda.
                          </TableCell>
                        </TableRow>
                      ) : (
                        notesSummary.recentes.map((nota) => (
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
                              {formatCurrency(parseFloat(nota.valor_nota) || 0)}
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
            </div>
            
            {/* Empresas cadastradas */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Empresas Cadastradas</CardTitle>
                  <CardDescription>
                    Você tem {companySummary.total} {companySummary.total === 1 ? 'empresa' : 'empresas'} cadastrada{companySummary.total !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {companySummary.recentes.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Nenhuma empresa cadastrada.</p>
                      <Button 
                        className="mt-2" 
                        variant="outline"
                        onClick={() => navigate("/company-management")}
                      >
                        Cadastrar empresa
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {companySummary.recentes.map((company) => (
                        <div 
                          key={company.id} 
                          className="border rounded-lg p-3 hover:bg-muted transition-colors"
                        >
                          <h3 className="font-medium">{company.razao_social}</h3>
                          <p className="text-sm text-muted-foreground">
                            {company.documento}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/company-management")}
                    className="gap-1"
                  >
                    Gerenciar empresas
                    <ArrowRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Ações rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/create-note")}
                >
                  <FileText size={24} />
                  <span>Nova Nota Fiscal</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/company-management")}
                >
                  <Building size={24} />
                  <span>Nova Empresa</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/profile-settings")}
                >
                  <UserRound size={24} />
                  <span>Editar Perfil</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/list-notes")}
                >
                  <FileCheck size={24} />
                  <span>Verificar Notas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}