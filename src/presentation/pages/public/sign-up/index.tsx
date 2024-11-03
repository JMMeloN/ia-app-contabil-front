import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "../../../components/layout/header";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <div className="min-h-[100vh] flex items-center justify-center px-1">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
        <Button className="self-start p-0" variant="link" type="button" onClick={() => navigate(-1)}>Voltar</Button>

          <CardTitle className="text-md">Cadastro</CardTitle>
          <CardDescription>
            Preencha os campos para fazer o seu cadastro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="">
          <div>
              <Label>Nome completo</Label>
              <Input />
            </div>

            <div>
              <Label>Celular</Label>
              <Input />
            </div>

            <div>
              <Label>E-mail</Label>
              <Input />
            </div>
<div className="grid grid-cols-2 gap-4">
            <div className="mt-4">
              <Label>Senha</Label>
              <Input />
            </div>

            <div className="mt-4">
              <Label>Confirme a senha</Label>
              <Input />
            </div>
            </div>
           
            <Button className="w-full mt-6">Entrar</Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
