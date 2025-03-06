import React from "react";
import logo from "../../../assets/logotipo-mono.png";
import logoWhite from "../../../assets/logo-white.png";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="text-center flex gap-2 items-center">
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
       App Contabil
      </div>
    </div>
  );
};

export default Loading;
