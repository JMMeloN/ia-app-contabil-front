import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Gerenciamento",
    description:
      "Nossa equipe cuidará da contabilidade geral da sua empresa.",
  },
  {
    icon: <MapIcon />,
    title: "Obrigações fiscais e tributárias",
    description:
      "Não fique com medo do leão, cuidaremos de todas as obrigações fiscais e tributárias da sua empresa.",
  },
  {
    icon: <PlaneIcon />,
    title: "Trabalhista",
    description:
      "Tenha total segurança no fechamento da sua folha de pagamento.",
  },
  {
    icon: <GiftIcon />,
    title: "Processual",
    description:
      "Mantenha sua empresa sempre apta a funcionar.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        Como nós{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
        trabalhamos
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Eleve sua empresa para o próximo nível.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
