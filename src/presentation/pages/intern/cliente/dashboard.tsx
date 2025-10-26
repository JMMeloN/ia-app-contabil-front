import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth, storage } from '@/firebase/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Loader2 } from 'lucide-react';
import type { NotaFiscalSolicitada } from '@/types/requestedNotes';

const statusLabels = {
  pendente: 'Pendente',
  processado: 'Processado',
  cancelado: 'Cancelado',
};

const statusColors = {
  pendente: 'bg-yellow-500',
  processado: 'bg-green-500',
  cancelado: 'bg-red-500',
};

export function ClienteDashboard() {
  const [notas, setNotas] = useState<NotaFiscalSolicitada[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchMinhasNotas();
  }, []);

  const fetchMinhasNotas = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const notasRef = collection(db, 'requestedNotes');
      const q = query(
        notasRef,
        where('clienteId', '==', auth.currentUser.uid),
        orderBy('dataSolicitacao', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const notasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as NotaFiscalSolicitada[];

      setNotas(notasData);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (notaId: string) => {
    setDownloading(notaId);
    try {
      const fileRef = ref(storage, `requestedNotes/${notaId}/nota_fiscal.pdf`);
      const url = await getDownloadURL(fileRef);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota_fiscal_${notaId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Erro ao baixar nota:', error);
      alert('Arquivo não disponível ou ainda não foi anexado');
    } finally {
      setDownloading(null);
    }
  };

  const notasProcessadas = notas.filter(n => n.status === 'processado').length;
  const notasPendentes = notas.filter(n => n.status === 'pendente').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Área do Cliente</h1>
        <p className="text-muted-foreground">Visualize e baixe suas notas fiscais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Notas Processadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{notasProcessadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Aguardando Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{notasPendentes}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Notas Fiscais</CardTitle>
          <CardDescription>
            Visualize o status e faça download das suas notas fiscais processadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando notas...</div>
          ) : notas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma solicitação encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Solicitação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.numeroNota}</TableCell>
                    <TableCell>{nota.clienteNome}</TableCell>
                    <TableCell>R$ {nota.valor?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[nota.status as keyof typeof statusColors] || 'bg-gray-500'}>
                        {statusLabels[nota.status as keyof typeof statusLabels] || nota.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(nota.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {nota.status === 'processado' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(nota.id)}
                          disabled={downloading === nota.id}
                        >
                          {downloading === nota.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Baixando...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Em processamento</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
