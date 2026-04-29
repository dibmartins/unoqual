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
  Printer,
  Calculator
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
                      {/* Encontra cálculos correspondentes se for staffing */}
                      {(() => {
                        const calcNurses = isStaffing ? inspection.staffingCalculations?.find(c => c.departmentId === entry.departmentId && c.professionalClass === "Nurse") : null;
                        const calcTechs = isStaffing ? inspection.staffingCalculations?.find(c => c.departmentId === entry.departmentId && c.professionalClass === "Technician") : null;
                        const the = calcNurses?.totalNursingHours || 0;
                        const qpTotal = (calcNurses?.requiredStaffing || 0) + (calcTechs?.requiredStaffing || 0);

                        return (
                          <>
                            {/* Dados Técnicos (Metadata) */}
                            {entry.metadata && typeof entry.metadata === 'object' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(entry.metadata).map(([key, value]) => {
                                  if (key === 'observations' || key === 'observacoes' || key === 'calculationInputs') return null;

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

                            {/* Dados de Cálculo de Dimensionamento */}
                            {isStaffing && entry.metadata && typeof entry.metadata === 'object' && (entry.metadata as any).calculationInputs && (
                              <div className="md:col-span-2 lg:col-span-3 p-6 bg-slate-50/50 rounded-xl border border-slate-200 shadow-sm mt-2">
                                <div className="flex items-center gap-2 mb-6 text-slate-800">
                                  <Calculator className="w-5 h-5 text-emerald-600" />
                                  <span className="text-sm font-bold uppercase tracking-wider">Cálculo de Quadro de Pessoal da Enfermagem</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Coluna de Entradas */}
                                  <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2">Parâmetros Inseridos</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">Jornada Semanal</span>
                                        <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.weeklyHours}h</span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">PCM</span>
                                        <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.pcm}</span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">PCI</span>
                                        <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.pci}</span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">PCAD</span>
                                        <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.pcad}</span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">PCSI</span>
                                        <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.pcsi}</span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">PCIt</span>
                                        <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.pcit}</span>
                                      </div>
                                      {(entry.metadata as any).calculationInputs.currentNurses !== undefined && (
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[10px] uppercase font-bold text-slate-500">Enfermeiros</span>
                                          <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.currentNurses}</span>
                                        </div>
                                      )}
                                      {(entry.metadata as any).calculationInputs.currentTechs !== undefined && (
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[10px] uppercase font-bold text-slate-500">Técnicos</span>
                                          <span className="text-sm font-semibold text-slate-900">{(entry.metadata as any).calculationInputs.currentTechs}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Coluna de Resultados */}
                                  {calcNurses && calcTechs && (
                                    <div className="space-y-4">
                                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2">Resultado do Cálculo</h4>

                                      <div className="flex flex-wrap gap-6 mb-4">
                                        <div>
                                          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total de Horas (THE)</span>
                                          <span className="text-2xl font-black text-slate-900">{the}h</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Quadro Necessário (QP)</span>
                                          <span className="text-2xl font-black text-emerald-600">{qpTotal}</span>
                                        </div>
                                      </div>

                                      <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-slate-600 font-medium">Enfermeiros:</span>
                                          <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-900">{calcNurses.currentStaffing}/{calcNurses.requiredStaffing}</span>
                                            {calcNurses.staffingGap >= 0 ? (
                                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 h-6"><CheckCircle2 className="w-3 h-3" /> OK (+{calcNurses.staffingGap})</Badge>
                                            ) : (
                                              <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 gap-1 h-6"><XCircle className="w-3 h-3" /> Falta {Math.abs(calcNurses.staffingGap)}</Badge>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
                                          <span className="text-slate-600 font-medium">Técnicos:</span>
                                          <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-900">{calcTechs.currentStaffing}/{calcTechs.requiredStaffing}</span>
                                            {calcTechs.staffingGap >= 0 ? (
                                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 h-6"><CheckCircle2 className="w-3 h-3" /> OK (+{calcTechs.staffingGap})</Badge>
                                            ) : (
                                              <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 gap-1 h-6"><XCircle className="w-3 h-3" /> Falta {Math.abs(calcTechs.staffingGap)}</Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
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
                          </>
                        );
                      })()}
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
