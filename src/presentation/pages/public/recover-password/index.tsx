import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "../../../components/layout/header";
import { Button } from "@/components/ui/button";
import {  useNavigate } from "react-router-dom";

export function RecoverPassword() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <div className="min-h-[100vh] flex items-center justify-center px-1">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <Button className="self-start p-0" variant="link" type="button" onClick={() => navigate(-1)}>Voltar</Button>
          <CardTitle className="text-md">Recuperar senha</CardTitle>
          <CardDescription>
            Preencha o seu e-mail para recuperar sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="">
            <div>
              <Label>E-mail</Label>
              <Input />
            </div>

            <Button className="w-full mt-6">Enviar</Button>

           
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
