import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Certifique-se de importar corretamente
import { z } from "zod";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { HeaderIntern } from "@/presentation/components/layout-intern/header";

// Esquema de validação com Zod
const schema = z.object({
  documento: z.string().nonempty("Documento é obrigatório"),
  inscricao_municipal: z.string().optional(),
  razao_social: z.string().nonempty("Razão social é obrigatória"),
  descricao: z.string().nonempty("Descrição é obrigatória"),
  telefone: z.string().nonempty("Telefone é obrigatório"),
  email: z.string().email("E-mail inválido"),
  desconto: z.string().optional(),
  pagamento_forma: z.string().optional(),
  valor_liquido: z.string().nonempty("Valor líquido é obrigatório"),
  valor_nota: z.string().nonempty("Valor da nota é obrigatório"),
  cep: z.string().nonempty("CEP é obrigatório"),
  endereco: z.string().nonempty("Endereço é obrigatório"),
  numero: z.string().nonempty("Número é obrigatório"),
  complemento: z.string().optional(),
});

export function CreateNote() {
  const navigate = useNavigate();

  // Inicialização do React Hook Form com validação do Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const docRef = await addDoc(collection(db, "requests-notes"), data);
      console.log("Documento enviado com sucesso! ID: ", docRef.id);
      alert("Nota fiscal criada com sucesso!");
      navigate("/list-notes");
    } catch (error) {
      console.error("Erro ao enviar documento: ", error);
      alert("Erro ao criar a nota fiscal. Tente novamente.");
    }
  };
  return (
    <div className="w-full">
      <HeaderIntern />

      <div className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 flex flex-col gap-4 w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <strong className="text-sm">
                  Quem vai receber sua nota fiscal?
                </strong>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col py-4 gap-4 w-full">
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {[
                  {
                    label: "Cpf / Cnpj",
                    name: "documento",
                    placeholder: "000.000.000-00",
                  },
                  {
                    label: "Inscrição Municipal",
                    name: "inscricao_municipal",
                  },
                  {
                    label: "Razão Social",
                    name: "razao_social",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <Label>{field.label}</Label>
                    <Input
                      {...register(field.name)}
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && (
                      <span className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
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
                    <Input {...register(field.name)} />
                    {errors[field.name] && (
                      <span className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <Label>Descrição dos serviços prestados</Label>
                <Textarea {...register("descricao")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <strong className="text-sm">Valores</strong>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Valores */}

              <div className="flex gap-4 w-full">
                {[
                  {
                    label: "Qual foi o desconto aplicado?",
                    name: "desconto",
                  },
                  { label: "Forma de pagamento", name: "pagamento_forma" },
                  { label: "Valor líquido da nota", name: "valor_liquido" },
                  { label: "Valor da nota", name: "valor_nota" },
                ].map((field) => (
                  <div key={field.name} className="flex-1">
                    <Label>{field.label}</Label>
                    <Input {...register(field.name)} />
                    {errors[field.name] && (
                      <span className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="w-full flex items-center gap-4 my-4">
                  <strong className="text-sm">Endereço</strong>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                {[
                  { label: "Cep", name: "cep" },
                  { label: "Endereço", name: "endereco" },
                  { label: "Número", name: "numero" },
                  { label: "Complemento", name: "complemento" },
                ].map((field) => (
                  <div key={field.name}>
                    <Label>{field.label}</Label>
                    <Input {...register(field.name)} />
                    {errors[field.name] && (
                      <span className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
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
              className="mt-6"
              variant="secondary"
              type="button"
              onClick={() => navigate("/list-notes")}
            >
              Voltar
            </Button>
            <Button className="mt-6" type="submit">
              Solicitar nota fiscal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
