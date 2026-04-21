import { getInspectionWithEntries } from "@/app/actions/inspection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/inspection/hub/item-card";
import { ClipboardCheck, Building2, User, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface InspectionDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function InspectionDetailsPage({ params }: InspectionDetailsPageProps) {
  const { id } = await params;
  const inspection = await getInspectionWithEntries(id);

  if (!inspection) {
    notFound();
  }

  const isCompleted = inspection.status === "completed";

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
              <ClipboardCheck className="w-10 h-10 text-blue-600" />
              Detalhes da Visita
            </h1>
            <p className="text-slate-500 font-medium">Histórico de Verificações Realizadas</p>
          </div>
        </div>
        
        <Badge variant={isCompleted ? "secondary" : "outline"} className="px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
          {isCompleted ? "Concluída" : "Rascunho"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Informações Gerais */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-1.5">
                <Label small>Unidade de Saúde</Label>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-white text-sm font-medium">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {inspection.facility.name}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label small>Inspetor Responsável</Label>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-white text-sm font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  {inspection.inspectorId === "system-user" ? "Diego Martins" : inspection.inspectorId}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label small>Data da Realização</Label>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-white text-sm font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(inspection.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main: Itens Verificados */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Itens Verificados</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">{inspection.entries.length} itens</Badge>
          </div>

          <div className="space-y-4">
            {inspection.entries.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30 text-slate-400">
                Nenhum item foi registrado nesta inspeção.
              </div>
            ) : (
              inspection.entries.map((entry) => (
                <ItemCard
                  key={entry.id}
                  type={entry.type}
                  checklistItemKey={entry.checklistItemKey}
                  complianceStatus={entry.complianceStatus}
                  departmentName={entry.department?.name}
                  metadata={entry.metadata}
                  readOnly // We need to add this prop to ItemCard
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <p className={`font-bold text-slate-500 uppercase tracking-wider ${small ? "text-[10px]" : "text-xs"}`}>
      {children}
    </p>
  );
}
