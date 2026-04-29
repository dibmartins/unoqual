import { getDashboardOverview, getDepartmentsAttention, getFacilitiesCompliance } from "@/app/actions/dashboard";
import { DepartmentsAttention } from "@/components/dashboard/departments-attention";
import { FacilitiesChart } from "@/components/dashboard/facilities-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Activity, Building2, ClipboardCheck, Network } from "lucide-react";

export default async function DashboardPage() {
  const [overview, facilities, departmentsAttention] = await Promise.all([
    getDashboardOverview(),
    getFacilitiesCompliance(),
    getDepartmentsAttention(),
  ]);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Geral</h1>
          <p className="text-slate-500 mt-1">
            Visão geral das unidades de saúde, setores e níveis de conformidade.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Unidades de Saúde"
          value={overview.totalFacilities}
          icon={<Building2 />}
          description="cadastradas no sistema"
        />
        <StatCard
          title="Setores Assistenciais"
          value={overview.totalDepartments}
          icon={<Network />}
          description="configurados nas unidades"
        />
        <StatCard
          title="Inspeções Realizadas"
          value={overview.totalInspections}
          icon={<ClipboardCheck />}
          description="avaliadas em auditorias"
        />
        <StatCard
          title="Conformidade Geral"
          value={`${overview.complianceRate}%`}
          icon={<Activity />}
          description="da organização"
          trend={{ value: overview.complianceRate, isPositive: overview.complianceRate >= 80 }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
        <FacilitiesChart data={facilities} />
        <DepartmentsAttention data={departmentsAttention} />
      </div>
    </div>
  );
}
