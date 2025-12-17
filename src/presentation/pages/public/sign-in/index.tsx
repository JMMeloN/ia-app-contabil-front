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
import { useState } from "react";
import { HttpClientFactory } from "@/main/factories/http/http-client-factory";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const httpClient = HttpClientFactory.makePublicHttpClient();

      const response = await httpClient.request({
        url: 'http://localhost:3333/auth/login',
        method: 'post',
        body: {
          email,
          password,
        },
      });

      if (response.statusCode === 200) {
        const { accessToken, user } = response.body;

        // Salvar token no localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user_role', user.role);

        // Redirecionar baseado no perfil
        if (user.role === 'CLIENTE') {
          navigate('/dashboard');
        } else if (user.role === 'OPERACIONAL' || user.role === 'ADMIN') {
          navigate('/operacional/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.body?.error || 'Email ou senha inválidos');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor. Certifique-se que o backend está rodando na porta 3333.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('Login com Google ainda não implementado. Use email e senha.');
  };

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
            <form onSubmit={handleEmailLogin}>
              <div className="mb-4">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="password">Senha</Label>
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

              <div className="mt-4">
                <Link className="text-primary m-auto block hover:underline" to="/recover-password">
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              <Button className="w-full mt-4 gap-2" type="button" variant="outline" onClick={handleGoogleLogin}>
                Login com Google (Em breve)
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
