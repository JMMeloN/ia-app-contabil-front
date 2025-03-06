import pilot from "../assets/pilot.png";
import pilotWhite from "../assets/pilot-white.png";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex items-center flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg block dark:hidden"
          />

          <img
            src={pilotWhite}
            alt=""
            className="w-[230px] object-contain rounded-lg h-auto hidden dark:block"
          />

          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  Sobre{" "}
                </span>
                a IA App Contabil
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Somos uma contabilidade simples, criada para facilitar os
                serviços necessários para o desenvolvimento e crescimento da sua
                empresa. Com nosso aplicativo, tenha em suas mãos o
                gerenciamento do seu negócio.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
