import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "O que é a contabilidade online?",
    answer: "	A contabilidade online foi desenvolvida para facilitar a vida do empresário, mantendo-o sempre em contato com a contabilidade responsável pelos trabalhos da sua empresa, tendo sua empresa sempre regular a operar suas rotinas, dando segurança e economia ao empresário no dia a dia.",
    value: "item-1",
  },
  {
    question: "Quais os serviços de uma contabilidade online?",
    answer:
      "Os serviços são os mesmos da sua contabilidade física, mas gerando uma economia no valor cobrado e segurança de fazer tudo sem sair de casa.",
    value: "item-2",
  },
  {
    question:
      "Quanto custa ter minha empresa em uma contabilidade online?",
    answer:
      "Em média custa 50% (cinquenta porcento) da sua contabilidade física e ainda terá serviços e facilidade em gerir seu negocio de forma simples e fácil. ",
    value: "item-3",
  },
  {
    question: "Posso trocar de contador em qual momento?",
    answer: "A troca de serviços contábeis poderá ser feita a qualquer momento, não precisando esperar o ano calendário terminar, converse com um especialista IA que passarão todos os cronogramas de troca de contabilidade. ",
    value: "item-4",
  },
  {
    question:
      "Como seria abrir CNPJ grátis?",
    answer:
      "	Nossa equipe fará a abertura total da sua empresa de forma gratuita, apenas a taxa da Junta Comercial do estado que será paga pelo empresário na hora da abertura, essa taxa varia de valor dependendo do estado de abertura.",
    value: "item-5",
  },
  {
    question:
      "Transformação MEI em ME grátis?",
    answer:
      "	Sim, faremos a transformação da sua empresa de forma gratuita, apenas a taxa da Junta Comercial do estado que será paga pelo empresário na hora da transformação, essa taxa varia de valor dependendo do estado de abertura.",
    value: "item-6",
  },
  {
    question:
      "Quais os beneficio de escolher a IA App Contábil?",
    answer:
      "Com nosso aplicativo ou site, poderá fazer a gestão da sua empresa de qualquer lugar, de uma forma simples e fácil. Toda sua empresa na palma de sua mão.      ",
    value: "item-7",
  },
  {
    question:
      "O que a IA App Contábil oferece?",
    answer:
      "	Com nosso software, desenvolvido por uma equipe que entende a necessidade de ser um empresário no Brasil, trouxemos de forma simples e fácil a gestão do seu negócio, oferecendo em nossa plataforma a parte fiscal, pessoal, gerencial e contábil da sua empresa.",
    value: "item-8",
  },
  {
    question:
      "Qual diferencial da IA App Contábil para as demais empresas de contabilidade online?",
    answer:
      "Desenvolvida para fazer sua contabilidade de forma simples, de fácil entendimento e compreensão, tendo tudo que precisa a qualquer momento, pois o nosso foco é trazer clareza ao seu negócio, onde e quando quiser na palma de sua mão. (celular, tablet ou notebook)",
    value: "item-9",
  },
  
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Perguntas {' '}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          frequentes
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Ainda com dúvidas?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
        Contate-nos!
        </a>
      </h3>
    </section>
  );
};
