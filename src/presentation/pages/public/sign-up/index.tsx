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
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Usuário registrado com sucesso!');
      navigate('/login'); // Redireciona para a página de login após o registro
    } catch (error: any) {
      setError('Erro ao registrar o usuário: ' + error.message);
      console.error("Erro ao registrar o usuário:", error.message);
    }
  };

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
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="password">Senha:</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 mb-4">{error}</p>
              )}

              <Button type="submit" className="w-full mt-6">Cadastrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
