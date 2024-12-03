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
import { signInWithPopup } from "firebase/auth";
import {auth, googleProvider} from '../../../../firebase/firebase'
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import icoGoogle from '../../../../assets/ico-google.png'
export function SignIn() {
  const navigate = useNavigate()
  console.log(auth)
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/home");
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login com Google: ", error);
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
            <Button className="w-full mt-4 gap-2" type="button" variant="outline" onClick={handleGoogleLogin}>
              <img className="w-4 h-4" src={icoGoogle} alt="" />
              Login com Google</Button>

           
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
