"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileWarning, UsersRound } from "lucide-react";

interface DepartmentAttentionData {
  id: string;
  name: string;
  facilityName: string;
  nonCompliantEntries: number;
  criticalFindings: number;
  totalNegativeStaffingGap: number;
}

interface DepartmentsAttentionProps {
  data: DepartmentAttentionData[];
}

export function DepartmentsAttention({ data }: DepartmentsAttentionProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Setores que Requerem Atenção</CardTitle>
        <CardDescription>
          Setores com não-conformidades críticas ou déficits de dimensionamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">Todos os setores estão em conformidade!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((dept) => (
              <div key={dept.id} className="flex items-start md:items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-slate-900">{dept.name}</span>
                  <span className="text-xs text-slate-500">{dept.facilityName}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm mt-2 md:mt-0">
                  {dept.criticalFindings > 0 && (
                    <div className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md" title="Achados Críticos">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      <span className="font-semibold">{dept.criticalFindings}</span>
                    </div>
                  )}
                  {dept.nonCompliantEntries > 0 && (
                    <div className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md" title="Não-conformidades">
                      <FileWarning className="w-4 h-4 mr-1.5" />
                      <span className="font-semibold">{dept.nonCompliantEntries}</span>
                    </div>
                  )}
                  {dept.totalNegativeStaffingGap < 0 && (
                    <div className="flex items-center text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md" title="Déficit de Pessoal">
                      <UsersRound className="w-4 h-4 mr-1.5" />
                      <span className="font-semibold">{dept.totalNegativeStaffingGap} prof.</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
