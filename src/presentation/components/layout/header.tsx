import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";


import logo from "../../../assets/logotipo-mono.png";
import logoWhite from "../../../assets/logo-white.png";



export const Navbar = () => {
  return (
    <header className=" flex justify-center sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto ">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-center ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 gap-2 font-bold text-xl flex"
            >
              <img src={logo} className="max-w-[40px] h-auto block dark:hidden" alt="" />
              <img src={logoWhite} className="max-w-[40px] h-auto hidden dark:block" alt="" />
               Contabil
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
