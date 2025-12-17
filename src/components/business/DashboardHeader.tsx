import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building } from "lucide-react";
import { useAuth } from "@/hooks";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = (user as any)?.displayName || (user as any)?.email || "Usuário";

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Olá, {userName}!</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu Dashboard de Gerenciamento de Notas Fiscais
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => navigate("/create-note")} 
          className="gap-2"
        >
          <PlusCircle size={16} />
          Nova Nota Fiscal
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/company-management")}
          className="gap-2"
        >
          <Building size={16} />
          Gerenciar Empresas
        </Button>
      </div>
    </div>
  );
};