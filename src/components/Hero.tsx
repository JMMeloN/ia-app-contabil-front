import { Button } from "./ui/button";
import logo from '../assets/logotipo.png'
import logoWhite from '../assets/whiteia.png'
export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center  py-4 md:py-4 gap-10 ">
      <div className="text-center lg:text-start space-y-6 ">
        <main className="text-4xl md:text-6xl font-bold">
          <h1 className="inline">
            A   {' '}
            <span className="inline bg-gradient-to-r from-[#f59696]  to-[#ff0000] text-transparent bg-clip-text">
             Contabilidade
            </span>{" "}
            simples {' '}
          </h1>{" "}
          <h2 className="inline">
          para a sua  {' '}
            <span className="inline bg-gradient-to-r from-[#f59696] via-[#ff0000] to-[#ff0000] text-transparent bg-clip-text">
            empresa
            </span>{" "}
           
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Gerencie sua empresa pelo nosso app contábil, abra sua empresa, emita notas fiscais e muito mais.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a target="_blank" className="md:w-auto w-full" href="https://wa.me/5561999333069?text=Olá,%gostaria%de%saber%mais%20sobre%20a%20IA%20App%20Contábil">
          <Button className="w-full md:w-1/3">Converse com um especialista </Button>
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <img src={logo} className="block dark:hidden max-w-[275px] md:w-auto md:max-w-full" alt="" />
        <img src={logoWhite} className="hidden dark:block max-w-[275px] md:w-auto md:max-w-full h-auto" alt="" />
        {/* <HeroCards /> */}
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
