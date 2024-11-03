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
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <div className="min-h-[100vh] flex items-center justify-center px-1">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
        <Button className="self-end p-0" variant="link" type="button" onClick={() => navigate('/sign-up')}>Cadastrar</Button>
          <CardTitle className="text-md">Log In</CardTitle>
          <CardDescription>
            Preencha os campos para fazer login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="">
            <div>
              <Label>E-mail</Label>
              <Input />
            </div>

            <div className="mt-4">
              <Label>Senha</Label>
              <Input />
            </div>

            <div >
              <Link className="text-primary mt-4 m-auto table hover:underline" to="/recover-password">
                Esqueceu sua senha?
              </Link>
            </div>

            <Button className="w-full mt-6" onClick={() => navigate('/home')}>Entrar</Button>

           
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
