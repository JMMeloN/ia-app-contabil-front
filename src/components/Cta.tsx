import { MailMinus, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Entre em contato
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
             agora
            </span>
            {" "}

            mesmo!
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Entre em contato conosco pelo WhatsApp ou E-mail, e um de nossos atendentes irá explicar tudo direitinho!
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2 ">
          <a className="mb-4 table md:w-auto w-full"  href="mailto:iaappcontabil@gmail.com?subject=Olá, gostaria de saber mais sobre a IA App Contábil">
          <Button className="w-full md:mr-4 md:w-auto min-w-[200px] flex gap-2"><MailMinus></MailMinus> E-mail</Button>
          </a>
          <a target="_blank" className="md:w-auto w-full" href="https://wa.me/5561999333069?text=Olá,%gostaria%de%saber%mais%20sobre%20a%20IA%20App%20Contábil">
          <Button
            className="w-full md:w-auto flex gap-2 min-w-[200px]"
          >
            <MessageCircle />
            WhatsApp
          </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
