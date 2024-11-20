import { SidebarTrigger } from "@/components/ui/sidebar";

import logo from "../../../../../assets/logotipo-mono.png";
import logoWhite from "../../../../../assets/logo-white.png";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CreateNote() {
  const navigate = useNavigate();

  return (
    <div className="w-full  ">
      <div className="border-b w-full h-[60px] relative flex items-center justify-center">
        <SidebarTrigger className="absolute top-0 left-0" />
        <div>
          <a
            rel="noreferrer noopener"
            href="/home"
            className="ml-2 gap-2 font-bold text-xl flex"
          >
            <img
              src={logo}
              className="max-w-[40px] h-auto block dark:hidden"
              alt=""
            />
            <img
              src={logoWhite}
              className="max-w-[40px] h-auto hidden dark:block"
              alt=""
            />
            Contabil
          </a>
        </div>
      </div>
      <div className="p-4">
        <div>
          <Card className="overflow-hidden">
          
            <CardContent>
              <form action="" className="py-4 flex flex-col gap-4 w-full">
               <Card className="">
                <CardHeader className="">
                  <CardTitle>
                   <strong   className="text-sm">Informações da empresa de origem</strong>

                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col  py-4 gap-4 w-full">
              
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  <div>
                    <Label>Cpf / Cnpj</Label>
                    <Input placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <Label>Inscrição Municipal</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Razão Social</Label>
                    <Input />
                  </div>
                </div>
                <div>
                  <Label>Descrição dos serviços prestados</Label>
                  <Textarea />
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <div>
                    <Label>Telefone</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input />
                  </div>
                </div>
                </CardContent>
               </Card>

               
             

                <div className="w-full flex items-center gap-4 my-4">
                  <strong>Valores</strong>
                  <div className="w-full border"></div>
                </div>
                <div className=" grid grid-cols-5 gap-4">
                  <div>
                    <Label>Qual foi o desconto aplicado?</Label>
                    <Input />
                  </div>

                  <div>
                    <Label>Forma de pagamento</Label>
                    <Input />
                  </div>

                  <div>
                    <Label>Valor liquido da nota</Label>
                    <Input />
                  </div>

                  <div>
                    <Label>Valor da nota </Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Desconto</Label>
                    <Input />
                  </div>
                </div>

                <div className="w-full flex items-center gap-4 my-4">
                  <strong>Endereço</strong>
                  <div className="w-full border"></div>
                </div>
                <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                  <div>
                    <Label>Cep</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Endereço</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Número</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Complemento</Label>
                    <Input />
                  </div>
                </div>
                <div className="flex gap-4 mt-6 ml-auto w-full justify-end">
                  <Button
                    className="  mt-6"
                    variant="secondary"
                    type="button"
                    onClick={() => navigate("/list-notes")}
                  >
                    Voltar
                  </Button>

                  <Button className="  mt-6" type="button">
                    Solicitar nota fiscal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
