import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Send, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '@/presentation/routes/route-paths';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestSchema, type RequestFormData } from '@/lib/validations/request-schema';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import { currencyMask, currencyToNumber } from '@/lib/utils/masks';

export function NewRequest() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [valorDisplay, setValorDisplay] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [emissaoAutomatica, setEmissaoAutomatica] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      companyId: '',
      valor: 0,
      dataEmissao: '',
      observacoes: '',
    },
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: API_ENDPOINTS.companies.base,
        method: 'get',
      });

      if (response.statusCode === 200) {
        setCompanies(response.body);
      }
    } catch (error) {
      toast.error('Erro ao carregar empresas', {
        description: 'Não foi possível carregar suas empresas cadastradas.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RequestFormData) => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();

      // Converte o valor para número se estiver como string
      const valorNumerico = typeof data.valor === 'string'
        ? currencyToNumber(data.valor)
        : data.valor;

      const response = await httpClient.request({
        url: API_ENDPOINTS.requests.base,
        method: 'post',
        body: {
          companyId: data.companyId,
          valor: valorNumerico,
          dataEmissao: data.dataEmissao,
          observacoes: data.observacoes,
          emissaoAutomatica: emissaoAutomatica,
        },
      });

      if (response.statusCode === 201) {
        if (emissaoAutomatica) {
          toast.success('Nota fiscal emitida automaticamente!', {
            description: 'Você receberá um email com o PDF da nota em instantes.',
          });
        } else {
          toast.success('Solicitação enviada com sucesso!', {
            description: 'A nota fiscal será processada em breve.',
          });
        }
        setTimeout(() => navigate(USER_ROUTES.MY_REQUESTS), 1500);
      } else {
        toast.error('Erro ao criar solicitação', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao criar solicitação', {
        description: error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(USER_ROUTES.MY_REQUESTS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Solicitação</h1>
          <p className="text-muted-foreground">
            Preencha os dados para solicitar a emissão de nota fiscal
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Solicitação</CardTitle>
          <CardDescription>
            Informe a empresa, valor e data de emissão desejada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Empresa */}
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const company = companies.find((c) => c.id === value);
                        setSelectedCompany(company);
                        // Resetar emissão automática ao trocar empresa
                        setEmissaoAutomatica(false);
                      }}
                      defaultValue={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            Carregando empresas...
                          </SelectItem>
                        ) : companies.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhuma empresa cadastrada
                          </SelectItem>
                        ) : (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.nome} - {company.cnpj}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Não encontrou a empresa?{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => navigate(USER_ROUTES.NEW_COMPANY)}
                        disabled={form.formState.isSubmitting}
                      >
                        Cadastre aqui
                      </Button>
                    </p>
                  </FormItem>
                )}
              />

              {/* Como deseja emitir? - Só aparece se a empresa suportar emissão automática */}
              {selectedCompany && selectedCompany.nfeioCompanyId && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium">Como deseja emitir a nota? *</h3>
                    <p className="text-sm text-muted-foreground">
                      Sua empresa está configurada para emissão automática
                    </p>
                  </div>

                  <RadioGroup
                    value={emissaoAutomatica ? 'automatica' : 'manual'}
                    onValueChange={(value) => setEmissaoAutomatica(value === 'automatica')}
                  >
                    <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                         onClick={() => setEmissaoAutomatica(true)}>
                      <RadioGroupItem value="automatica" id="automatica" />
                      <div className="flex-1">
                        <label htmlFor="automatica" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-600" />
                          Eu emito (Automático)
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Nota fiscal será emitida instantaneamente via NFe.io
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                         onClick={() => setEmissaoAutomatica(false)}>
                      <RadioGroupItem value="manual" id="manual" />
                      <div className="flex-1">
                        <label htmlFor="manual" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          IAContabil emite
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Solicitação será processada manualmente pela equipe
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Valor */}
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Nota (R$) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          R$
                        </span>
                        <Input
                          type="text"
                          placeholder="0,00"
                          className="pl-10"
                          disabled={form.formState.isSubmitting}
                          value={valorDisplay}
                          onChange={(e) => {
                            const masked = currencyMask(e.target.value);
                            setValorDisplay(masked);
                            field.onChange(currencyToNumber(masked));
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Emissão */}
              <FormField
                control={form.control}
                name="dataEmissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Emissão *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Observações */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais sobre a nota (opcional)"
                        rows={4}
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(USER_ROUTES.MY_REQUESTS)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
