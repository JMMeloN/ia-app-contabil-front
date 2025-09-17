import { useEffect } from "react";
import { HeaderIntern } from "@/presentation/components/layout-intern/header";
import { useNotas, useCompanies } from "@/hooks";
import { 
  DashboardHeader,
  StatsCards,
  RecentNotesTable,
  CompaniesSection,
  QuickActions
} from "@/components/business";

export function Dashboard() {
  const { fetchNotas } = useNotas();
  const { fetchCompanies } = useCompanies();

  useEffect(() => {
    // Load data when component mounts
    fetchNotas();
    fetchCompanies();
  }, [fetchNotas, fetchCompanies]);

  return (
    <div className="w-full">
      <HeaderIntern />
      
      <div className="p-4">
        <div className="flex flex-col gap-6">
          <DashboardHeader />
          <StatsCards />
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RecentNotesTable />
            </div>
            <div>
              <CompaniesSection />
            </div>
          </div>
          
          <QuickActions />
        </div>
      </div>
    </div>
  );
}