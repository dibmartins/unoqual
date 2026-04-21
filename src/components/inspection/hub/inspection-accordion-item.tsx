"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calculator, ClipboardCheck } from "lucide-react";
import { ComplianceStatus } from "@prisma/client";

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  status: ComplianceStatus;
  children: React.ReactNode;
  isStaffing?: boolean;
}

export function InspectionAccordionItem({ 
  title, 
  subtitle, 
  status, 
  children, 
  isStaffing 
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isStaffing ? Calculator : ClipboardCheck;

  const statusColors = {
    [ComplianceStatus.COMPLIANT]: "bg-green-100 text-green-700 border-green-200",
    [ComplianceStatus.NON_COMPLIANT]: "bg-red-100 text-red-700 border-red-200",
    [ComplianceStatus.NOT_APPLICABLE]: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const statusLabels = {
    [ComplianceStatus.COMPLIANT]: "Conforme",
    [ComplianceStatus.NON_COMPLIANT]: "Não Conforme",
    [ComplianceStatus.NOT_APPLICABLE]: "N/A",
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-slate-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 leading-tight">{title}</h4>
            {subtitle && <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
