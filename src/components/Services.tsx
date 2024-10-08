import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import cubeLeg from "../assets/cube-leg.png";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Abra seu CNPJ grátis",
    description:
      "Nossos especialistas farão a abertura do seu CNPJ de forma gratuita e sem burocracias.",
    icon: <ChartIcon />,
  },
  {
    title: "Transforme seu MEI em ME",
    description:
      "Faremos a transformação do seu MEI para ME de forma gratuita.",
    icon: <WalletIcon />,
  },
  {
    title: "Trocar de contabilidade",
    description:
      "Não precisa encerra o ano calendário para fazer a troca de contador, converse com um especialista e faça agora mesmo.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32" id="features">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8  table">
            <span className="bg-gradient-to-b  from-primary/60 to-primary text-transparent bg-clip-text">
              Nossos{" "}
            </span>
            serviços
          </h2>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={cubeLeg}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
