import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';

interface Company {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  cidade: string;
  estado: string;
  nfeioCompanyId?: string | null;
  cityServiceCode?: string | null;
}

export function ManageCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [nfeioCompanyId, setNfeioCompanyId] = useState('');
  const [cityServiceCode, setCityServiceCode] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();

      // Buscar todas as empresas (operacional pode ver todas)
      const response = await httpClient.request({
        url: '/companies',
        method: 'get',
      });

      if (response.statusCode === 200) {
        setCompanies(response.body);
      }
    } catch (error: any) {
      toast.error('Erro ao carregar empresas', {
        description: error.message || 'Não foi possível carregar as empresas.',
      });
    } finally {
      setLoading(false);
    }
  };

  const openConfigDialog = (company: Company) => {
    setSelectedCompany(company);
    setNfeioCompanyId(company.nfeioCompanyId || '');
    setCityServiceCode(company.cityServiceCode || '2690'); // Padrão: Consultoria
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!selectedCompany) return;

    try {
      setSaving(true);
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();

      const response = await httpClient.request({
        url: `/companies/${selectedCompany.id}`,
        method: 'put',
        body: {
          nfeioCompanyId: nfeioCompanyId || null,
          cityServiceCode: cityServiceCode || null,
        },
      });

      if (response.statusCode === 200) {
        toast.success('Configuração salva!', {
          description: `Empresa ${selectedCompany.nome} configurada com sucesso.`,
        });

        setConfigDialogOpen(false);
        fetchCompanies(); // Recarregar lista
      }
    } catch (error: any) {
      toast.error('Erro ao salvar configuração', {
        description: error.message || 'Não foi possível salvar a configuração.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando empresas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Empresas</h1>
        <p className="text-muted-foreground">
          Configure as integrações NFe.io para emissão automática de notas fiscais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Empresas Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma empresa cadastrada no sistema
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status NFe.io</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.nome}</TableCell>
                    <TableCell>{company.cnpj}</TableCell>
                    <TableCell>
                      {company.cidade}/{company.estado}
                    </TableCell>
                    <TableCell>
                      {company.nfeioCompanyId ? (
                        <span className="text-green-600 font-medium">✓ Configurado</span>
                      ) : (
                        <span className="text-amber-600 font-medium">⚠ Não configurado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConfigDialog(company)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar NFe.io
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Configuração */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurar Integração NFe.io</DialogTitle>
            <DialogDescription>
              Configure os dados de integração com o NFe.io para {selectedCompany?.nome}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nfeioCompanyId">
                Company ID do NFe.io <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nfeioCompanyId"
                placeholder="Ex: 5f8d7c3b2a1e9f4b3c2d1a0e"
                value={nfeioCompanyId}
                onChange={(e) => setNfeioCompanyId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                ID da empresa no painel do NFe.io.
                <a
                  href="https://app.nfe.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Criar empresa →
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cityServiceCode">
                Código do Serviço Municipal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cityServiceCode"
                placeholder="Ex: 2690"
                value={cityServiceCode}
                onChange={(e) => setCityServiceCode(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Código do serviço conforme tabela do município. Padrão: 2690 (Consultoria)
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Como funciona?
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Quando configurado, o cliente pode escolher "Emitir automaticamente"</li>
                <li>• A nota fiscal será emitida via NFe.io usando esses dados</li>
                <li>• O cliente receberá o PDF da nota por email automaticamente</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfigDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
