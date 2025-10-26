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
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Usuário autenticado detectado:", user.email);
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          console.log("Criando perfil para novo usuário");
          const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || undefined,
            role: 'cliente',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          await setDoc(userDocRef, userProfile);
          console.log("Perfil criado com sucesso");
        }
        
        console.log("Navegando para /list-notes");
        navigate("/list-notes");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      console.log("Iniciando login com Google via popup...");
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login com Google bem-sucedido:", result.user.email);
      
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log("Criando perfil para novo usuário do Google");
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
      }
      
      navigate("/list-notes");
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      setError("Erro ao fazer login com Google: " + error.message);
      setLoading(false);
    }
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
