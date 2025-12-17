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
import { HttpClientFactory } from "@/main/factories/http/http-client-factory";
import { toast } from "sonner";
import { API_ENDPOINTS } from '@/main/config/api-config';

export function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const httpClient = HttpClientFactory.makePublicHttpClient();

      const response = await httpClient.request({
        url: API_ENDPOINTS.auth.register,
        method: 'post',
        body: {
          name,
          email,
          password,
        },
      });

      if (response.statusCode === 201) {
        toast.success('Cadastro realizado com sucesso!', {
          description: 'Você já pode fazer login com suas credenciais.',
        });
        setTimeout(() => navigate('/sign-in'), 1500);
      } else {
        setError(response.body?.error || 'Erro ao realizar cadastro');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
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
                <Label htmlFor="name">Nome Completo:</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                />
              </div>

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
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
              </div>

              {error && (
                <p className="text-red-500 mb-4">{error}</p>
              )}

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
