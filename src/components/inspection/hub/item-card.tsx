"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, ClipboardCheck, Calculator, Building2 } from "lucide-react";
import { ComplianceStatus } from "@prisma/client";

interface ItemCardProps {
  type: string;
  checklistItemKey: string;
  complianceStatus: ComplianceStatus;
  departmentName?: string;
  metadata?: any;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

export function ItemCard({ 
  type, 
  checklistItemKey, 
  complianceStatus, 
  departmentName, 
  metadata,
  onEdit, 
  onDelete,
  readOnly = false
}: ItemCardProps) {  const isStaffing = type === "staffing";
  const Icon = isStaffing ? Calculator : ClipboardCheck;

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${isStaffing ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">
                  {isStaffing ? "Dimensionamento de Pessoal" : "Inspeção de Setor"}
                </h3>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                  {checklistItemKey}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {departmentName || "Unidade (Geral)"}
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
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600" onClick={onEdit}>
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
