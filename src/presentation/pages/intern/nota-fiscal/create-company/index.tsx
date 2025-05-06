/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { HeaderIntern } from "@/presentation/components/layout-intern/header";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const companySchema = z.object({
  documento: z.string().nonempty("Documento é obrigatório"),
  inscricao_municipal: z.string().optional(),
  razao_social: z.string().nonempty("Razão social é obrigatória"),
  telefone: z.string().nonempty("Telefone é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cep: z.string().nonempty("CEP é obrigatório"),
  endereco: z.string().nonempty("Endereço é obrigatório"),
  numero: z.string().nonempty("Número é obrigatório"),
  complemento: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const usuario = auth.currentUser;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const fetchCompanies = async () => {
    if (!usuario) return;

    try {
      const companiesRef = collection(db, `users/${usuario.uid}/companies`);
      const querySnapshot = await getDocs(companiesRef);

      const companiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setCompanies(companiesData);
    } catch (error) {
      console.error("Erro ao buscar empresas: ", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [usuario]);

  const onSubmit = async (data: CompanyFormData) => {
    if (!usuario) {
      alert("Usuário não logado. Por favor, faça login.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("Usuário:", usuario.uid);
      console.log("Dados a serem salvos:", data);
      
      const companyData = {
        ...data,
        createdAt: new Date().toISOString(), // Converter para string ISO
      };
      
      console.log("Dados formatados:", companyData);
      console.log("Caminho de salvamento:", `users/${usuario.uid}/companies`);
      
      const companiesRef = collection(db, `users/${usuario.uid}/companies`);
      await addDoc(companiesRef, companyData);
      
      alert("Empresa cadastrada com sucesso!");
      reset();
      fetchCompanies();
    } catch (error) {
      console.error("Erro detalhado ao cadastrar empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCompany = async (companyId: string) => {
    if (!usuario) return;
    
    if (window.confirm("Tem certeza que deseja remover esta empresa?")) {
      try {
        await deleteDoc(doc(db, `users/${usuario.uid}/companies`, companyId));
        alert("Empresa removida com sucesso!");
        fetchCompanies();
      } catch (error) {
        console.error("Erro ao remover empresa: ", error);
        alert("Erro ao remover empresa. Tente novamente.");
      }
    }
  };

  return (
    <div className="w-full">
      <HeaderIntern />
      
      <div className="p-4">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar Nova Empresa</CardTitle>
              <CardDescription>
                Cadastre as empresas para as quais você emite notas fiscais regularmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  {[
                    { label: "CPF / CNPJ", name: "documento", placeholder: "000.000.000-00" },
                    { label: "Inscrição Municipal", name: "inscricao_municipal" },
                    { label: "Razão Social", name: "razao_social" },
                  ].map((field) => (
                    <div key={field.name}>
                      <Label>{field.label}</Label>
                      <Input {...register(field.name as any)} placeholder={field.placeholder} />
                      {errors[field.name as keyof CompanyFormData] && (
                        <span className="text-red-500 text-sm">
                          {errors[field.name as keyof CompanyFormData]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  {[
                    { label: "Telefone", name: "telefone" },
                    { label: "E-mail", name: "email" },
                  ].map((field) => (
                    <div key={field.name}>
                      <Label>{field.label}</Label>
                      <Input {...register(field.name as any)} />
                      {errors[field.name as keyof CompanyFormData] && (
                        <span className="text-red-500 text-sm">
                          {errors[field.name as keyof CompanyFormData]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                  {[
                    { label: "CEP", name: "cep" },
                    { label: "Endereço", name: "endereco" },
                    { label: "Número", name: "numero" },
                    { label: "Complemento", name: "complemento" },
                  ].map((field) => (
                    <div key={field.name}>
                      <Label>{field.label}</Label>
                      <Input {...register(field.name as any)} />
                      {errors[field.name as keyof CompanyFormData] && (
                        <span className="text-red-500 text-sm">
                          {errors[field.name as keyof CompanyFormData]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de empresas cadastradas */}
          <Card>
            <CardHeader>
              <CardTitle>Empresas Cadastradas</CardTitle>
              <CardDescription>
                Empresas disponíveis para emissão de notas fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhuma empresa cadastrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>{company.razao_social}</TableCell>
                        <TableCell>{company.documento}</TableCell>
                        <TableCell>{company.email}</TableCell>
                        <TableCell>{company.telefone}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveCompany(company.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Voltar para o Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}