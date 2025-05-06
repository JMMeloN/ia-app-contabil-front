/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { HeaderIntern } from "@/presentation/components/layout-intern/header";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { CheckCircle2, FileDown, Copy, Plus } from "lucide-react";

// Schema para validação do formulário
const schema = z.object({
  empresa_id: z.string().nonempty("Selecione uma empresa"),
  descricao: z.string().nonempty("Descrição é obrigatória"),
  desconto: z.string().optional(),
  pagamento_forma: z.string().optional(),
  valor_liquido: z.string().nonempty("Valor líquido é obrigatório"),
  valor_nota: z.string().nonempty("Valor da nota é obrigatório"),
  observacoes: z.string().optional(),
});

// Interface para tipo de empresa
interface Company {
  id: string;
  documento: string;
  inscricao_municipal?: string;
  razao_social: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
}

// Interface para tipo de nota fiscal anterior
interface PreviousNote {
  id: string;
  razao_social: string;
  documento: string;
  descricao: string;
  valor_nota: string;
  created_at: Date;
}

export function CreateNote() {
  const navigate = useNavigate();
  const usuario = auth.currentUser;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [previousNotes, setPreviousNotes] = useState<PreviousNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [noteId, setNoteId] = useState("");
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      empresa_id: "",
      descricao: "",
      desconto: "",
      pagamento_forma: "",
      valor_liquido: "",
      valor_nota: "",
      observacoes: "",
    }
  });

  // Observa a mudança do ID da empresa para atualizar o objeto selecionado
  const empresaId = watch("empresa_id");

  // Buscar empresas cadastradas do usuário
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!usuario) return;

      try {
        const companiesRef = collection(db, `users/${usuario.uid}/companies`);
        const querySnapshot = await getDocs(companiesRef);

        const companiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Company[];
        
        setCompanies(companiesData);
      } catch (error) {
        console.error("Erro ao buscar empresas: ", error);
      }
    };

    fetchCompanies();
  }, [usuario]);

  // Buscar notas fiscais anteriores para sugestões
  useEffect(() => {
    const fetchPreviousNotes = async () => {
      if (!usuario) return;

      try {
        const notesRef = collection(db, `users/${usuario.uid}/notes`);
        const querySnapshot = await getDocs(query(notesRef));

        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at ? new Date(doc.data().created_at.toDate()) : new Date(),
        })) as PreviousNote[];
        
        // Ordenar por data de criação (mais recentes primeiro)
        notesData.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        
        setPreviousNotes(notesData.slice(0, 5)); // Pegar as 5 notas mais recentes
      } catch (error) {
        console.error("Erro ao buscar notas anteriores: ", error);
      }
    };

    fetchPreviousNotes();
  }, [usuario]);

  // Atualizar empresa selecionada quando o ID mudar
  useEffect(() => {
    if (empresaId) {
      const company = companies.find(c => c.id === empresaId);
      setSelectedCompany(company || null);
    } else {
      setSelectedCompany(null);
    }
  }, [empresaId, companies]);

  // Função para usar dados de nota anterior
  const usePreviousNote = (note: PreviousNote) => {
    // Encontrar empresa correspondente
    const company = companies.find(c => c.documento === note.documento);
    
    if (company) {
      setValue("empresa_id", company.id);
      setSelectedCompany(company);
    }
    
    setValue("descricao", note.descricao);
    setValue("valor_nota", note.valor_nota);
    
    // Calcular valor líquido como 70% do valor da nota (exemplo)
    const valorLiquido = parseFloat(note.valor_nota) * 0.7;
    setValue("valor_liquido", valorLiquido.toString());
  };

  // Manipulador de envio do formulário
  const onSubmit = async (data: any) => {
    if (!usuario) {
      alert("Usuário não logado. Por favor, faça login.");
      return;
    }

    if (!selectedCompany) {
      alert("Selecione uma empresa válida.");
      return;
    }

    setIsLoading(true);

    try {
      const noteData = {
        idUser: usuario.uid,
        empresa_id: data.empresa_id,
        documento: selectedCompany.documento,
        inscricao_municipal: selectedCompany.inscricao_municipal || "",
        razao_social: selectedCompany.razao_social,
        descricao: data.descricao,
        telefone: selectedCompany.telefone,
        email: selectedCompany.email,
        desconto: data.desconto || "",
        pagamento_forma: data.pagamento_forma || "",
        valor_liquido: data.valor_liquido,
        valor_nota: data.valor_nota,
        cep: selectedCompany.cep,
        endereco: selectedCompany.endereco,
        numero: selectedCompany.numero,
        complemento: selectedCompany.complemento || "",
        observacoes: data.observacoes || "",
        status: 'Emitida',
        created_at: new Date(),
      };

      const docRef = await addDoc(collection(db, `users/${usuario.uid}/notes`), noteData);
      
      console.log("Nota fiscal criada com sucesso! ID: ", docRef.id);
      setNoteId(docRef.id);
      setShowSuccess(true);
      reset(); // Limpar o formulário
    } catch (error) {
      console.error("Erro ao criar nota fiscal: ", error);
      alert("Erro ao criar a nota fiscal. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyNoteId = () => {
    navigator.clipboard.writeText(noteId);
    alert("ID da nota copiado para a área de transferência!");
  };

  return (
    <div className="w-full">
      <HeaderIntern />

      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="py-4 flex flex-col gap-4 w-full">
          {/* Seleção de Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-sm">Selecione para quem emitir a nota fiscal</span>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/company-management")}
                >
                  <Plus size={16} className="mr-2" />
                  Cadastrar Nova Empresa
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col py-4 gap-4 w-full">
              <div className="grid md:grid-cols-1 grid-cols-1 gap-4">
                <div>
                  <Label>Empresa</Label>
                  <Select 
                    onValueChange={(value) => setValue("empresa_id", value)}
                    value={empresaId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhuma empresa cadastrada
                        </SelectItem>
                      ) : (
                        companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.razao_social} - {company.documento}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.empresa_id && (
                    <span className="text-red-500 text-sm">
                      {errors.empresa_id.message}
                    </span>
                  )}
                </div>
              </div>

              {selectedCompany && (
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Dados da empresa selecionada:</h3>
                  <p><strong>Razão Social:</strong> {selectedCompany.razao_social}</p>
                  <p><strong>Documento:</strong> {selectedCompany.documento}</p>
                  <p><strong>Email:</strong> {selectedCompany.email}</p>
                  <p><strong>Endereço:</strong> {selectedCompany.endereco}, {selectedCompany.numero}, {selectedCompany.complemento} - CEP: {selectedCompany.cep}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usar nota anterior - Sugestões */}
          {previousNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="text-sm">Usar dados de nota anterior</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {previousNotes.map((note) => (
                    <div key={note.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div>
                        <p className="font-semibold">{note.razao_social}</p>
                        <p className="text-sm">Valor: R$ {note.valor_nota} - {note.created_at.toLocaleDateString()}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => usePreviousNote(note)}
                      >
                        <Copy size={16} className="mr-2" />
                        Usar dados
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Descrição dos serviços */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="text-sm">Descrição dos serviços prestados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Descrição detalhada</Label>
                  <Textarea 
                    {...register("descricao")} 
                    rows={4} 
                    placeholder="Descreva os serviços prestados..."
                  />
                  {errors.descricao && (
                    <span className="text-red-500 text-sm">
                      {errors.descricao.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label>Observações adicionais (opcional)</Label>
                  <Textarea 
                    {...register("observacoes")} 
                    rows={2} 
                    placeholder="Informações adicionais para o cliente..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valores */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="text-sm">Valores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                {[
                  { label: "Valor da nota", name: "valor_nota", placeholder: "0.00" },
                  { label: "Valor líquido", name: "valor_liquido", placeholder: "0.00" },
                  { label: "Desconto aplicado (opcional)", name: "desconto", placeholder: "0.00" },
                  { label: "Forma de pagamento (opcional)", name: "pagamento_forma", placeholder: "PIX, Transferência..." },
                ].map((field) => (
                  <div key={field.name}>
                    <Label>{field.label}</Label>
                    <Input 
                       /* @ts-ignore */ 
                      {...register(field.name)} 
                      placeholder={field.placeholder}
                    />
                    {errors[field.name as keyof typeof errors] && (
                      <span className="text-red-500 text-sm">
                        {errors[field.name as keyof typeof errors]?.message}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-4 mt-6 ml-auto w-full justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/list-notes")}
            >
              Voltar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? "Processando..." : "Solicitar nota fiscal"}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de sucesso */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
              Nota fiscal criada com sucesso!
            </DialogTitle>
            <DialogDescription>
              Sua solicitação de nota fiscal foi registrada no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="font-semibold">ID da nota: #{noteId}</p>
            </div>
            <Button variant="outline" size="sm" onClick={copyNoteId}>
              <Copy size={16} className="mr-2" />
              Copiar ID
            </Button>
          </div>
          
          <DialogFooter className="flex gap-4 sm:justify-between">
            <Button variant="secondary" onClick={() => navigate("/list-notes")}>
              <FileDown size={16} className="mr-2" />
              Ver todas as notas
            </Button>
            <Button onClick={() => setShowSuccess(false)}>
              Solicitar nova nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}