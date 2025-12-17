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
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useCompanies } from "@/hooks";

export const CompaniesSection = () => {
  const navigate = useNavigate();
  const { companies, loading, error } = useCompanies();

  const recentCompanies = companies.slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Empresas Cadastradas</CardTitle>
        <CardDescription>
          {loading ? (
            "Carregando..."
          ) : (
            `Você tem ${companies.length} ${companies.length === 1 ? 'empresa' : 'empresas'} cadastrada${companies.length !== 1 ? 's' : ''}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando empresas...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mb-2" />
            <span className="text-sm">{error}</span>
          </div>
        ) : recentCompanies.length === 0 ? (
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