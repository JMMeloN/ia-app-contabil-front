import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCompanies } from "@/hooks";

export const CompaniesSection = () => {
  const navigate = useNavigate();
  const { companies } = useCompanies();
  
  const recentCompanies = companies.slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Empresas Cadastradas</CardTitle>
        <CardDescription>
          Você tem {companies.length} {companies.length === 1 ? 'empresa' : 'empresas'} cadastrada{companies.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentCompanies.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhuma empresa cadastrada.</p>
            <Button 
              className="mt-2" 
              variant="outline"
              onClick={() => navigate("/company-management")}
            >
              Cadastrar empresa
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCompanies.map((company) => (
              <div 
                key={company.id} 
                className="border rounded-lg p-3 hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">{company.razao_social}</h3>
                <p className="text-sm text-muted-foreground">
                  {company.cnpj}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/company-management")}
          className="gap-1"
        >
          Gerenciar empresas
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};