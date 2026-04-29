"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, ClipboardCheck, Calculator, Building2, Sigma, CheckCircle2 } from "lucide-react";
import { ComplianceStatus } from "@prisma/client";

interface ItemCardProps {
  entry: any;
  hasCalculation?: boolean;
  onEdit: (entry: any) => void;
  onDelete: (id: string) => void;
  onCalculate?: (entry: any) => void;
  readOnly?: boolean;
}

export function ItemCard({ 
  entry, 
  hasCalculation,
  onEdit, 
  onDelete,
  onCalculate,
  readOnly = false
}: ItemCardProps) {
  const { type, checklistItemKey, complianceStatus, departmentName, metadata } = entry;
  const isStaffing = type === "staffing";
  const Icon = isStaffing ? Calculator : ClipboardCheck;

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${isStaffing ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">
                  {isStaffing ? "Dimensionamento de Pessoal" : 
                   checklistItemKey === "infraestrutura" ? "Inspeção de Infraestrutura" :
                   checklistItemKey === "processos" ? "Inspeção de Processos" :
                   checklistItemKey === "equipamentos" ? "Inspeção de Equipamentos" :
                   checklistItemKey === "documentacao" ? "Inspeção de Documentação" :
                   "Inspeção de Setor"}
                </h3>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                  {isStaffing ? checklistItemKey : "Checklist"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/50 text-slate-600 border-slate-200 shadow-sm">
                    <Building2 className="w-3 h-3 mr-1 opacity-50" />
                    {departmentName || "Setor Geral"}
                  </Badge>
                  {isStaffing && hasCalculation && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Cálculo Realizado
                    </Badge>
                  )}
                </div>
                
                {isStaffing && metadata?.qp && (
                  <div className="font-medium text-emerald-600">
                    QP: {metadata.qp} profissionais
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                {complianceStatus === ComplianceStatus.COMPLIANT && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">Conforme</Badge>
                )}
                {complianceStatus === ComplianceStatus.NON_COMPLIANT && (
                  <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">Não Conf.</Badge>
                )}
                {complianceStatus === ComplianceStatus.NOT_APPLICABLE && (
                  <Badge variant="secondary">N/A</Badge>
                )}
              </div>
            </div>
          </div>

          {!readOnly && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {isStaffing && onCalculate && (
                <Button variant="ghost" size="icon" onClick={() => onCalculate(entry)} className="h-8 w-8 text-slate-500 hover:text-emerald-600" title="Calcular Quadro">
                  <Calculator className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} className="h-8 w-8 text-slate-500 hover:text-indigo-600" title="Editar Metadados">
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)} className="h-8 w-8 text-slate-500 hover:text-red-600" title="Excluir">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
