import { getInspectionWithEntries } from "@/app/actions/inspection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InspectionAccordionItem } from "@/components/inspection/hub/inspection-accordion-item";
import { 
  ClipboardCheck, 
  Building2, 
  User, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  MessageSquare,
  FileText,
  Printer
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComplianceStatus } from "@prisma/client";

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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
              <ClipboardCheck className="w-10 h-10 text-blue-600" />
              Relatório de Visita
            </h1>
            <p className="text-slate-500 font-medium">Resultados e Evidências Coletadas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isCompleted && (
            <Link href={`/inspection/${id}/report`}>
              <Button variant="outline" className="font-bold gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                <FileText className="w-4 h-4" />
                Visualizar Laudo
              </Button>
            </Link>
          )}
          <Badge variant={isCompleted ? "secondary" : "outline"} className="px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
            {isCompleted ? "Concluída" : "Rascunho"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-4">
              <CardTitle className="text-sm font-bold">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-1.5">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Unidade de Saúde</p>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-white text-sm font-medium">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {inspection.facility.name}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Inspetor Responsável</p>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-white text-sm font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  {inspection.inspectorId === "system-user" ? "Diego Martins" : inspection.inspectorId}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Data da Realização</p>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-white text-sm font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(inspection.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Itens Verificados</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">{inspection.entries.length} itens registrados</Badge>
          </div>

          <div className="space-y-4">
            {inspection.entries.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30 text-slate-400 font-medium">
                Nenhum item foi registrado nesta inspeção.
              </div>
            ) : (
              inspection.entries.map((entry) => {
                const isStaffing = entry.type === "staffing";
                const title = isStaffing ? "Dimensionamento de Pessoal" : 
                             entry.checklistItemKey === "infraestrutura" ? "Inspeção de Infraestrutura" :
                             entry.checklistItemKey === "processos" ? "Inspeção de Processos" :
                             entry.checklistItemKey === "equipamentos" ? "Inspeção de Equipamentos" :
                             entry.checklistItemKey === "documentacao" ? "Inspeção de Documentação" : "Checklist de Setor";
                
                return (
                  <InspectionAccordionItem
                    key={entry.id}
                    title={title}
                    subtitle={entry.department?.name || "Unidade (Geral)"}
                    status={entry.complianceStatus}
                    isStaffing={isStaffing}
                  >
                    <div className="space-y-6">
                      {/* Dados Técnicos (Metadata) */}
                      {entry.metadata && typeof entry.metadata === 'object' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(entry.metadata).map(([key, value]) => {
                            if (key === 'observations') return null;
                            
                            // Formatação amigável para booleanos e status
                            let displayValue = String(value);
                            if (value === true) displayValue = "Sim";
                            if (value === false) displayValue = "Não";
                            if (value === ComplianceStatus.COMPLIANT) displayValue = "Conforme";
                            if (value === ComplianceStatus.NON_COMPLIANT) displayValue = "Não Conforme";
                            if (value === ComplianceStatus.NOT_APPLICABLE) displayValue = "N/A";

                            return (
                              <div key={key} className="p-3 bg-white rounded-lg border border-slate-100 flex flex-col gap-1 shadow-sm">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-sm font-semibold text-slate-800 break-words">
                                  {displayValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Observação */}
                      {entry.observation && (
                        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 mb-2 text-slate-600">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Observações e Evidências</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed italic">
                            "{entry.observation}"
                          </p>
                        </div>
                      )}

                      {/* Legenda de Status Rápida */}
                      <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 pt-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Conforme
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-red-500" /> Não Conforme
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Não Aplicável
                        </div>
                      </div>
                    </div>
                  </InspectionAccordionItem>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
