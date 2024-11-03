import { SidebarTrigger } from "@/components/ui/sidebar";

import logo from "../../../../assets/logotipo-mono.png";
import logoWhite from "../../../../assets/logo-white.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Home() {
  return (
    <div className="w-full  ">
      <div className="border-b w-full h-[60px] relative flex items-center justify-center">
        <SidebarTrigger className="absolute top-0 left-0" />
        <div>
          <a
            rel="noreferrer noopener"
            href="/home"
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
            Contabil
          </a>
        </div>
      </div>
      <div className="p-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Emissão de notas</CardTitle>
              <CardDescription>
                Nessa área você emitirá sua nota fiscal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action="">
                <div>
                  <Label>Produto</Label>
                  <Input />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
