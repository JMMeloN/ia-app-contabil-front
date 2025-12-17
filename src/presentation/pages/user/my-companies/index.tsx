import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '@/presentation/routes/route-paths';
import { useState, useEffect } from 'react';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { toast } from 'sonner';

export function MyCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: '/companies',
        method: 'get',
      });

      if (response.statusCode === 200) {
        setCompanies(response.body);
      }
    } catch (error) {
      toast.error('Erro ao carregar empresas', {
        description: 'Não foi possível carregar suas empresas.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta empresa?')) return;

    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: `/companies/${companyId}`,
        method: 'delete',
      });

      if (response.statusCode === 200) {
        toast.success('Empresa deletada com sucesso!');
        fetchCompanies(); // Recarregar lista
      } else {
        toast.error('Erro ao deletar empresa', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao deletar empresa', {
        description:
          error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Empresas</h1>
          <p className="text-muted-foreground">
            Empresas cadastradas para emissão de notas fiscais
          </p>
        </div>
        <Button onClick={() => navigate(USER_ROUTES.NEW_COMPANY)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Empresa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando empresas...
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma empresa cadastrada. Clique em "Cadastrar Empresa" para
              começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      {company.nome}
                    </TableCell>
                    <TableCell>{company.cnpj}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.telefone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(company.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toast.info('Função de editar em breve!')
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
