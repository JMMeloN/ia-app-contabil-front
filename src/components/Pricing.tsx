import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "MEI",
    popular: 0,
    price: 99,
    description:
      "",
    buttonText: "Quero esse!",
    benefitList: [
      "Contabilidade completa",
      "Abertura ou transformação  gratuita cnpj ",
      "Atendimento via chat e e-mail das 9h às 17h30",
      "Atendimento via WhatsApp das 9h às 21h",
      "Emissão de notas fiscais pela equipe: até 3 notas.",
    ],
  },
  {
    title: "Básico",
    popular: 0,
    price: 175,
    description:
      "",
    buttonText: "Quero esse!",
    benefitList: [
      "Contabilidade completa",
      "Abertura ou transformação  gratuita cnpj ",
      "Atendimento via chat e e-mail das 9h às 17h30",
      "Atendimento via WhatsApp das 9h às 21h",
      "Emissão de notas fiscais pela equipe: até 5 notas.",
      "Importação e conciliação de extrato: 1 conta",
      "Pró-labore dos sócios: 1 sócio",
      "Certificado digital gratuito",
    ],
  },
  {
    title: "Popular",
    popular: 1,
    price: 350,
    description:
      "",
    buttonText: "Quero esse!",
    benefitList: [
      "Contabilidade completa",
      "Abertura ou transformação  gratuita cnpj ",
      "Atendimento via chat e e-mail das 9h às 17h30",
      "Atendimento via WhatsApp das 9h às 21h",
      "Atendimento via telefone das 9h às 18h",
      "Emissão de notas fiscais pela equipe: até 30 notas.",
      "Importação e conciliação de extrato: 3 contas",
      "Pró-labore dos sócios: 3 sócios",
      "Certificado digital gratuito",
      "Folha de pagamento: até 3 funcionários.",
      "Declaração do Imposto de Renda de Pessoa Física"
    ],
  },
  {
    title: "Plus",
    popular: 0,
    price: 650,
    description:
      "",
    buttonText: "Quero esse!",
    benefitList: [
      "Contabilidade completa",
      "Abertura ou transformação  gratuita cnpj",
      "Atendimento via chat e e-mail das 9h às 17h30",
      "Atendimento via WhatsApp das 9h às 21h",
      "Atendimento via telefone das 9h às 18h",
      "Emissão de notas fiscais pela equipe: até 60 notas.",
      "Importação e conciliação de extrato: 5 contas",
      "Pró-labore dos sócios: 5 sócios",
      "Certificado digital gratuito",
      "Folha de pagamento: até 10 funcionários.",
      "Declaração do Imposto de Renda de Pessoa Física",
      "Videoconferência contábil com time de especialistas"
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Nosso
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          planos{" "}
        </span>
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Encontre o plano perfeito para as necessidades da sua empresa!
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Mais popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">R${pricing.price}</span>
                <span className="text-muted-foreground"> /mês</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <a 
                href={`https://wa.me/5561996027208?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20plano%20${pricing.title}%20de%20R$${pricing.price}/mês`}
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button className="w-full">{pricing.buttonText}</Button>
              </a>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex">
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2 text-sm">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
