import logo from "../assets/logotipo-mono.png";
import logoWhite from "../assets/logo-white.png";
export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-x-8 gap-y-8">
        <div className="col-span-full xl:col-span-1">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex gap-2"
          >
            <img
              src={logo}
              className="max-w-[70px] h-auto block dark:hidden"
              alt=""
            />
            <img
              src={logoWhite}
              className="max-w-[70px] h-auto hidden dark:block"
              alt=""
            />
            App Contabil
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-md">IA App Contábil Ltda</h3>
          <div className="opacity-60">CRC/DF 024.790/0-0</div>
          <div className="opacity-60">CNPJ: 54.833.446/0001-26</div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-md">Localização</h3>
          <div className="opacity-60 ">
            Rua Copaíba 1 Torre A Sala 2313 e 2314
          </div>

          <div className="opacity-60 ">DF Century Plaza - Águas Claras</div>

          <div className="opacity-60 ">CEP: 71.919-900</div>

          <div className="opacity-60 ">Brasília - DF</div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-md">Contato</h3>
          <div className="opacity-60 ">(61) 3257-6374</div>
          <div className="opacity-60 ">(61) 9 9933-3069</div>
          <div className="opacity-60 ">iaappcontabil@gmail.com</div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-md">Siga-nos</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://www.instagram.com/ia_appcontabil?igsh=MTlnYmpyYjhwZHdqbA=="
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              Instagram
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              Linkedin
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-md">Navegação</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Perguntas frequentes
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Planos
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Entre em contato
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Serviços
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Sobre
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>&copy; 2024 IA App Contabil</h3>
      </section>
    </footer>
  );
};
