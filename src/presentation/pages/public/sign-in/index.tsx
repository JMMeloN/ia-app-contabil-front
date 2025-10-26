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
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
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

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/list-notes");
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
          role: 'cliente',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await setDoc(userDocRef, userProfile);
      }
      
      navigate("/list-notes");
    } catch (error: any) {
      console.error("Erro ao fazer login com Google: ", error.message);
      setError('Erro ao fazer login com Google: ' + error.message);
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
              <Button className="w-full mt-4 gap-2" type="button" variant="outline" onClick={handleGoogleLogin}>
                <img className="w-4 h-4" src={icoGoogle} alt="Ícone do Google" />
                Login com Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
