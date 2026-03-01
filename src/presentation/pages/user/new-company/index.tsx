import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Building2, FileKey, ShieldCheck, ClipboardCheck, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '@/presentation/routes/route-paths';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema, type CompanyFormData } from '@/lib/validations/company-schema';
import { toast } from 'sonner';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import { phoneMask, cnpjMask, cepMask } from '@/lib/utils/masks';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' }, { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' }, { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' }, { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' }, { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' }, { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' }, { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' }, { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' }, { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' }, { value: 'TO', label: 'Tocantins' },
];

const TAX_REGIMES = [
  { value: 'Isento', label: 'Isento' },
  { value: 'MicroempreendedorIndividual', label: 'MEI' },
  { value: 'SimplesNacional', label: 'Simples Nacional' },
  { value: 'LucroPresumido', label: 'Lucro Presumido' },
  { value: 'LucroReal', label: 'Lucro Real' },
];

const SPECIAL_TAX_REGIMES = [
  { value: 'Automatico', label: 'Automático' },
  { value: 'Nenhum', label: 'Nenhum' },
  { value: 'MicroempresaMunicipal', label: 'Microempresa Municipal' },
  { value: 'Estimativa', label: 'Estimativa' },
  { value: 'SociedadeDeProfissionais', label: 'Sociedade de Profissionais' },
  { value: 'Cooperativa', label: 'Cooperativa' },
];

const LEGAL_NATURES = [
  { value: 'Empresario', label: 'Empresário Individual' },
  { value: 'SociedadeEmpresariaLimitada', label: 'Sociedade Empresária Limitada (LTDA)' },
  { value: 'SociedadeAnonimaAberta', label: 'Sociedade Anônima Aberta' },
  { value: 'SociedadeAnonimaFechada', label: 'Sociedade Anônima Fechada' },
  { value: 'EireliNaturezaEmpresaria', label: 'EIRELI' },
  { value: 'SociedadeSimplePura', label: 'Sociedade Simples Pura' },
  { value: 'Cooperativa', label: 'Cooperativa' },
];

export function NewCompany() {
  const navigate = useNavigate();
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nome: '',
      nomeFantasia: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      dataAbertura: '',
      regimeTributario: undefined,
      naturezaJuridica: undefined,
      inscricaoMunicipal: '',
      inscricaoEstadual: '',
      cityServiceCode: '',
      certificatePassword: '',
      regimeEspecialTributacao: 'Automatico',
      determinacaoImpostoFederal: 'NotInformed',
      determinacaoImpostoMunicipal: 'NotInformed',
    },
  });

  const uploadCertificate = async (companyId: string, file: File, password?: string) => {
    setIsUploadingCertificate(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (password) formData.append('password', password);

      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
      const response = await httpClient.request({
        url: `${API_ENDPOINTS.companies.base}/${companyId}/certificate`,
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.statusCode === 200) {
        toast.success('Certificado digital enviado com sucesso!');
      } else {
        toast.warning('Empresa cadastrada, mas houve um erro no certificado', {
          description: response.body?.error || 'Você poderá reenviá-lo depois na edição da empresa.',
        });
      }
    } catch (error) {
      console.error('Erro no upload do certificado:', error);
      toast.warning('Certificado não enviado', {
        description: 'A empresa foi criada, mas não conseguimos processar o certificado agora.',
      });
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();

      const body = {
        ...data,
        dataAbertura: data.dataAbertura ? new Date(data.dataAbertura).toISOString() : undefined,
      };

      // 1. Criar a empresa
      const response = await httpClient.request({
        url: API_ENDPOINTS.companies.base,
        method: 'post',
        body,
      });

      if (response.statusCode === 201) {
        const createdCompany = response.body;
        
        toast.success('Empresa cadastrada com sucesso!');

        // 2. Upload do certificado se existir
        if (data.certificateFile && data.certificateFile[0]) {
          await uploadCertificate(
            createdCompany.id, 
            data.certificateFile[0], 
            data.certificatePassword
          );
        }

        setTimeout(() => navigate(USER_ROUTES.MY_COMPANIES), 1500);
      } else {
        toast.error('Erro ao cadastrar empresa', {
          description: response.body?.error || 'Tente novamente.',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao cadastrar empresa', {
        description: error.response?.data?.error || 'Erro ao conectar com o servidor.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(USER_ROUTES.MY_COMPANIES)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Cadastrar Empresa</h1>
          <p className="text-muted-foreground">
            Insira os dados da empresa para gestão e faturamento
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Cadastrais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Cadastrais</CardTitle>
              <CardDescription>Informações básicas da pessoa jurídica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Empresa ABC Ltda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomeFantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Academia do Código" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00.000.000/0000-00"
                          {...field}
                          onChange={(e) => field.onChange(cnpjMask(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataAbertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Abertura</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados Fiscais (OPCIONAL) */}
          <Card className="border-muted bg-muted/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Dados Fiscais & Tributários (Opcional)</CardTitle>
              </div>
              <CardDescription>Dados necessários para a emissão automática de notas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="regimeTributario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regime Tributário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o regime" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TAX_REGIMES.map((regime) => (
                            <SelectItem key={regime.value} value={regime.value}>
                              {regime.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="naturezaJuridica"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Natureza Jurídica</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a natureza" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEGAL_NATURES.map((nature) => (
                            <SelectItem key={nature.value} value={nature.value}>
                              {nature.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inscricaoMunicipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inscrição Municipal</FormLabel>
                      <FormControl>
                        <Input placeholder="Número CCM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inscricaoEstadual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inscrição Estadual</FormLabel>
                      <FormControl>
                        <Input placeholder="Inscrição Estadual (IE)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cityServiceCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1.05" {...field} />
                      </FormControl>
                      <FormDescription>Consulte na prefeitura</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botão para mostrar campos avançados */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full mt-2 border border-dashed text-xs"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                Configurações Técnicas Avançadas (NFe.io)
              </Button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-in fade-in slide-in-from-top-2">
                  <FormField
                    control={form.control}
                    name="regimeEspecialTributacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regime Especial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SPECIAL_TAX_REGIMES.map((r) => (
                              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroJuntaComercial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIRE (Junta Comercial)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apenas números" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rpsSerie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Série do RPS</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: IO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rpsNumero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Próximo Nº RPS</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aliquotaIss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alíquota ISS (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 2,5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prefeituraLogin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Prefeitura</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prefeituraSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Prefeitura</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificado Digital */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileKey className="h-5 w-5 text-primary" />
                <CardTitle>Certificado Digital (Opcional)</CardTitle>
              </div>
              <CardDescription>Upload do arquivo .pfx para automatizar a emissão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="certificateFile"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Arquivo do Certificado (.pfx)</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept=".pfx,.p12"
                          onChange={(e) => onChange(e.target.files)}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certificatePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha do Certificado</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/50 p-3 rounded border">
                <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                <p>
                  Seus dados são criptografados e enviados diretamente para o processamento fiscal seguro.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contato & Localização */}
          <Card>
            <CardHeader>
              <CardTitle>Contato & Localização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contato *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@empresa.com.br" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => field.onChange(phoneMask(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => field.onChange(cepMask(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BRAZILIAN_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12"
              onClick={() => navigate(USER_ROUTES.MY_COMPANIES)}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12" 
              disabled={form.formState.isSubmitting || isUploadingCertificate}
            >
              {form.formState.isSubmitting ? (
                <>Cadastrando...</>
              ) : isUploadingCertificate ? (
                <>Enviando Certificado...</>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Finalizar Cadastro
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
