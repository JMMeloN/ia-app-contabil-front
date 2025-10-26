import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Loader2, CheckCircle, FileText } from 'lucide-react';
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

export function OperacionalDashboard() {
  const [notas, setNotas] = useState<NotaFiscalSolicitada[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalSolicitada | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTodasNotas();
  }, []);

  const fetchTodasNotas = async () => {
    setLoading(true);
    try {
      const notasRef = collection(db, 'requestedNotes');
      const q = query(notasRef, orderBy('dataSolicitacao', 'desc'));
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

  const handleUploadNota = async () => {
    if (!file || !selectedNota) return;

    setUploading(true);
    try {
      const fileRef = ref(storage, `requestedNotes/${selectedNota.id}/nota_fiscal.pdf`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await updateDoc(doc(db, 'requestedNotes', selectedNota.id), {
        status: 'processado',
        dataUltimaAtualizacao: new Date().toISOString(),
        anexoUrl: downloadURL,
      });

      setNotas(prev => prev.map(n => 
        n.id === selectedNota.id 
          ? { ...n, status: 'processado', dataUltimaAtualizacao: new Date().toISOString() }
          : n
      ));

      alert('Nota fiscal anexada com sucesso!');
      setSelectedNota(null);
      setFile(null);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao anexar nota fiscal');
    } finally {
      setUploading(false);
    }
  };

  const notasPendentes = notas.filter(n => n.status === 'pendente').length;
  const notasProcessadas = notas.filter(n => n.status === 'processado').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Área Operacional</h1>
        <p className="text-muted-foreground">Gerencie solicitações e anexe notas fiscais</p>
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
            <CardTitle className="text-sm font-medium">Aguardando Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{notasPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{notasProcessadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Notas Fiscais</CardTitle>
          <CardDescription>
            Anexe as notas fiscais às solicitações pendentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando solicitações...</div>
          ) : notas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma solicitação encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
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
                    <TableCell className="text-sm text-muted-foreground">{nota.clienteEmail}</TableCell>
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
                      {nota.status === 'pendente' ? (
                        <Button
                          size="sm"
                          onClick={() => setSelectedNota(nota)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Anexar Nota
                        </Button>
                      ) : (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Processado
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedNota} onOpenChange={() => setSelectedNota(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anexar Nota Fiscal</DialogTitle>
            <DialogDescription>
              Cliente: {selectedNota?.clienteNome} | Valor: R$ {selectedNota?.valor?.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Selecione o arquivo PDF da nota fiscal:</label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>
            
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedNota(null)} disabled={uploading}>
              Cancelar
            </Button>
            <Button onClick={handleUploadNota} disabled={!file || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar e Processar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
