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
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, db } from "../../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import icoGoogle from "../../../../assets/ico-google.png";
import type { UserProfile } from "@/types/user";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log("Verificando redirect result...");
        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result);
        
        if (result?.user) {
          console.log("Usuário encontrado no redirect:", result.user.email);
          const userDocRef = doc(db, 'users', result.user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            console.log("Criando perfil para novo usuário");
            const userProfile: UserProfile = {
              uid: result.user.uid,
              email: result.user.email || '',
              displayName: result.user.displayName || undefined,
              role: 'cliente',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            await setDoc(userDocRef, userProfile);
            console.log("Perfil criado com sucesso");
          } else {
            console.log("Usuário já possui perfil");
          }
          
          console.log("Navegando para /list-notes");
          navigate("/list-notes");
        } else {
          console.log("Nenhum resultado de redirect encontrado");
        }
      } catch (error: any) {
        console.error("Erro no redirect:", error);
        setError("Erro ao processar login: " + error.message);
      }
    };
    
    handleRedirectResult();
  }, [navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithRedirect(auth, googleProvider);
  };

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/list-notes");
    } catch (error: any) {
      console.error("Erro ao fazer login com email e senha: ", error.message);
      setError('Erro ao fazer login com email e senha: ' + error.message);
    }
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

              <Button type="submit" className="w-full mt-6">Entrar</Button>
              <Button className="w-full mt-4 gap-2" type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading}>
                <img className="w-4 h-4" src={icoGoogle} alt="Ícone do Google" />
                {loading ? 'Redirecionando...' : 'Login com Google'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
