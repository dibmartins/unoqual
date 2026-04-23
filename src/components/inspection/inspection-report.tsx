"use client";

import { translate } from "@/lib/translations";
import { generateInspectionPDF } from "@/lib/report-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Building2,
  User,
  Calendar
} from "lucide-react";

interface InspectionReportProps {
  inspection: any;
}

export function InspectionReport({ inspection }: InspectionReportProps) {
  const isCompleted = inspection.status === "completed";
  const reportDate = inspection.completedAt 
    ? new Date(inspection.completedAt).toLocaleDateString("pt-BR") 
    : new Date(inspection.createdAt).toLocaleDateString("pt-BR");

  const staffingEntries = inspection.entries.filter((e: any) => e.type === "staffing");
  const checkEntries = inspection.entries.filter((e: any) => e.type !== "staffing");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Barra de Ações do Laudo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Visualização do Laudo</h2>
            <p className="text-xs text-slate-500 font-medium">Documento oficial de conformidade técnica</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => generateInspectionPDF(inspection)}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 font-bold gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir PDF
          </Button>
        </div>
      </div>

      {/* Papel do Laudo (Simulado) */}
      <div className="bg-white shadow-2xl border border-slate-200 mx-auto max-w-[800px] min-h-[1050px] p-8 pb-24 relative overflow-hidden">
        {/* Marca d'água de rascunho se não estiver completo */}
        {!isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg]">
            <span className="text-[120px] font-black">RASCUNHO</span>
          </div>
        )}

        {/* Cabeçalho do Documento */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">UNOQUAL</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gestão de Qualidade</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-800">LAUDO DE INSPEÇÃO</h2>
            <p className="text-xs font-medium text-slate-500">Ref: {inspection.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-6 border-b border-slate-100">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Unidade de Saúde</label>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-bold text-slate-800">{inspection.facility.name}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Data da Inspeção</label>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-bold text-slate-800">{reportDate}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Inspetor Responsável</label>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-bold text-slate-800">
                {inspection.inspectorId === "system-user" ? "Diego Martins" : inspection.inspectorId}
              </span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Status do Laudo</label>
            <div>
              <span className={`px-2 py-0.5 rounded text-[9px] tracking-wider font-black uppercase ${
                isCompleted ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {translate(inspection.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Seção de Dimensionamento */}
        {staffingEntries.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-2 mb-3 uppercase tracking-wider">
              Resultados de Dimensionamento
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-bold text-slate-600">Setor</th>
                    <th className="px-3 py-1.5 text-left font-bold text-slate-600">Ocupação</th>
                    <th className="px-3 py-1.5 text-left font-bold text-slate-600">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {staffingEntries.map((e: any) => (
                    <tr key={e.id}>
                      <td className="px-3 py-2 font-medium text-slate-700">{e.department?.name || "Unidade"}</td>
                      <td className="px-3 py-2 text-slate-600">{e.metadata?.professionalClass || "N/A"}</td>
                      <td className="px-3 py-2">
                        <span className={`font-bold ${e.complianceStatus === 'compliant' ? 'text-green-600' : 'text-red-600'}`}>
                          {translate(e.complianceStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Seção de Conformidade Técnica */}
        {checkEntries.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-900 border-l-4 border-emerald-600 pl-2 mb-3 uppercase tracking-wider">
              Conformidade Técnica e Processos
            </h3>
            <div className="space-y-4">
              {checkEntries.map((e: any) => (
                <div key={e.id} className="p-3 border rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{translate(e.checklistItemKey)}</span>
                      <h4 className="font-bold text-sm text-slate-800">{e.department?.name || "Geral"}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      {e.complianceStatus === 'compliant' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : e.complianceStatus === 'non_compliant' ? (
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className="text-[10px] font-bold uppercase">{translate(e.complianceStatus)}</span>
                    </div>
                  </div>

                  {/* Detalhamento do Metadata */}
                  {e.metadata && typeof e.metadata === 'object' && Object.keys(e.metadata).length > 0 && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2.5 bg-white p-2 rounded border border-slate-100">
                      {Object.entries(e.metadata).map(([key, value]) => {
                        if (key === 'observations') return null;
                        let displayValue = String(value);
                        if (value === true) displayValue = "Sim";
                        if (value === false) displayValue = "Não";
                        if (typeof value === 'string') displayValue = translate(value);
                        
                        return (
                          <div key={key} className="flex flex-col border-b border-slate-50 pb-0.5">
                            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-0.5">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-700">{displayValue}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {e.observation && (
                    <p className="text-[11px] text-slate-600 italic mt-2 border-t pt-2 border-slate-200">
                      <strong>Parecer do Auditor:</strong> "{e.observation}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Áreas de Assinatura */}
        <div className="mt-12 pb-8 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mx-2">
              <p className="text-[11px] font-bold text-slate-800">
                {inspection.inspectorId === "system-user" ? "Diego Martins" : inspection.inspectorId}
              </p>
              <p className="text-[9px] text-slate-500 uppercase font-medium">Responsável Técnico / Auditor</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mx-2">
              <p className="text-[11px] font-bold text-slate-800">Assinatura do Gestor da Unidade</p>
              <p className="text-[9px] text-slate-500 uppercase font-medium">Responsável Técnico da Unidade</p>
            </div>
          </div>
        </div>

        {/* Rodapé Interno do PDF */}
        <div className="absolute bottom-8 left-8 right-8 border-t pt-3 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Unoqual © {new Date().getFullYear()}</span>
          <span>Autenticidade: {inspection.id}</span>
        </div>
      </div>
    </div>
  );
}
