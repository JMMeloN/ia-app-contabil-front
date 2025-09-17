import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Building,
  UserRound,
  FileCheck,
} from "lucide-react";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate("/create-note")}
          >
            <FileText size={24} />
            <span>Nova Nota Fiscal</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate("/company-management")}
          >
            <Building size={24} />
            <span>Nova Empresa</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate("/profile-settings")}
          >
            <UserRound size={24} />
            <span>Editar Perfil</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate("/list-notes")}
          >
            <FileCheck size={24} />
            <span>Verificar Notas</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};