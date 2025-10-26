import { SidebarTrigger } from "@/components/ui/sidebar";

import logo from "../../../assets/logotipo-mono.png";
import logoWhite from "../../../assets/logo-white.png";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

export function HeaderIntern() {

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = "/sign-in";
      })
      .catch((error) => {
        console.error("Erro ao fazer logout: ", error);
        window.location.href = "/sign-in";
      });
  };

  return (
    <div className="border-b w-full h-[60px] relative flex items-center justify-center">
      <SidebarTrigger className="absolute top-0 left-0" />
      <div>
        <a
          rel="noreferrer noopener"
          href="/dashboard"
          className="ml-2 gap-2 font-bold text-xl flex"
        >
          <img
            src={logo}
            className="max-w-[40px] h-auto block dark:hidden"
            alt=""
          />
          <img
            src={logoWhite}
            className="max-w-[40px] h-auto hidden dark:block"
            alt=""
          />
          App Contabil
        </a>
      </div>
      {auth.currentUser && (
        <Button className="absolute right-4 top-4 " size="sm" variant="outline" onClick={handleLogout}>
         <LogOut />
         Sair
        </Button>
      )}
    </div>
  );
}
