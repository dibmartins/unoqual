"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { upsertEntryAction } from "@/app/actions/inspection";
import { ComplianceStatus } from "@prisma/client";

// Form Components (To be implemented)
import { DimensionamentoForm } from "./dimensionamento-form";
// import { DimensionamentoMedicoForm } from "./dimensionamento-medico-form";
import { InfraForm } from "./infra-form";
import { ProcessForm } from "./process-form";
import { EquipmentForm } from "./equipment-form";
import { DocumentForm } from "./document-form";

interface FormManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "staffing" | "inspection" | null;
  inspectionId: string;
  facility: { id: string; name: string; departments: { id: string; name: string }[] };
  initialData?: any;
  onSuccess: () => void;
  existingEntries: any[];
}

export function FormManagerModal({
  isOpen,
  onClose,
  mode,
  inspectionId,
  facility,
  initialData,
  onSuccess,
  existingEntries
}: FormManagerModalProps) {
  const [step, setStep] = useState<0 | 1>(0);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [inspectionType, setInspectionType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety check: Don't render anything if facility is missing
  if (!facility && isOpen) return null;

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setStep(1);
        setDepartmentId(initialData.departmentId || "");
        setOccupation(initialData.checklistItemKey || "");
        setInspectionType(initialData.checklistItemKey || "");
      } else {
        setStep(0);
        setDepartmentId("");
        setOccupation("");
        setInspectionType("");
      }
    }
  }, [isOpen, initialData]);

  const isFormTypeDimensionamento = mode === "staffing";
  
  // Rule: Check if Sector/Occupation already exists
  const checkDuplicate = () => {
    if (initialData) return false; // Allowed if editing
    
    const key = isFormTypeDimensionamento ? occupation : inspectionType;
    const targetDeptId = departmentId === "facility-global" ? null : (departmentId || null);
    return existingEntries.some(e => 
      e.departmentId === targetDeptId && 
      e.checklistItemKey === key
    );
  };

  const handleNext = () => {
    if (isFormTypeDimensionamento && !occupation) {
      alert("Selecione uma ocupação.");
      return;
    }
    if (!isFormTypeDimensionamento && (!departmentId || !inspectionType)) {
      alert("Selecione o setor e o tipo de inspeção.");
      return;
    }
    
    if (checkDuplicate()) {
      alert("Este item já foi adicionado a esta inspeção.");
      return;
    }
    
    setStep(1);
  };

  const handleSave = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await upsertEntryAction({
        inspectionId,
        departmentId: departmentId === "facility-global" ? undefined : departmentId || undefined,
        type: mode || "checklist",
        checklistItemKey: isFormTypeDimensionamento ? occupation : inspectionType,
        complianceStatus: data.complianceStatus || ComplianceStatus.COMPLIANT,
        metadata: data.metadata,
        observation: data.observation,
      });

      if (res.success) {
        onSuccess();
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o formulário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {mode === "staffing" 
              ? (initialData ? "Editar Dimensionamento" : "Incluir Dimensionamento")
              : (initialData ? "Editar Verificação" : "Adicionar Verificação")
            }
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            {step === 1 ? (
               `para equipe ${occupation || inspectionType} em ${
                 departmentId === "facility-global" 
                 ? "Geral (Unidade de Saúde)" 
                 : facility.departments.find(d => d.id === departmentId)?.name || "Setor Geral"
               }`
            ) : (
              "Selecione as informações básicas para continuar"
            )}
          </DialogDescription>
        </DialogHeader>

        {step === 0 ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Setor / Departamento</Label>
              <Select onValueChange={(val) => setDepartmentId(val || "")} value={departmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Geral (Unidade de Saúde)" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="facility-global">Geral (Unidade de Saúde)</SelectItem>
                  {facility.departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isFormTypeDimensionamento ? (
              <div className="space-y-2">
                <Label>Ocupação</Label>
                <Select onValueChange={(val) => setOccupation(val || "")} value={occupation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a profissão..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medicina">Médico</SelectItem>
                    <SelectItem value="Enfermagem">Equipe de Enfermagem</SelectItem>
                    <SelectItem value="Fisioterapeuta">Fisioterapeuta</SelectItem>
                    <SelectItem value="Nutricionista">Nutricionista</SelectItem>
                    {/* Mais conforme ocupacoes.md */}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Note: Para médicos, utilizaremos o formulário específico.</p>
              </div>
            ) : (
                <div className="space-y-2">
                <Label>Tipo de Inspeção</Label>
                <Select onValueChange={(val) => setInspectionType(val || "")} value={inspectionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o módulo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infraestrutura">Infraestrutura Física</SelectItem>
                    <SelectItem value="processos">Processos e Rotinas</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos e Materiais</SelectItem>
                    <SelectItem value="documentacao">Documentações e Alvarás</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter className="mt-8">
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleNext} className="bg-blue-600 px-8">Continuar</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4">
            {/* Renderizar o form específico */}
            {mode === "staffing" && (
                <DimensionamentoForm 
                  initialData={initialData} 
                  onSubmit={handleSave} 
                  isLoading={isSubmitting}
                  isMedical={occupation === "Medicina"}
                />
            )}
            
            {mode === "inspection" && inspectionType === "infraestrutura" && (
                <InfraForm 
                  initialData={initialData} 
                  onSubmit={handleSave} 
                  isLoading={isSubmitting}
                />
            )}

            {mode === "inspection" && inspectionType === "processos" && (
                <ProcessForm 
                  initialData={initialData} 
                  onSubmit={handleSave} 
                  isLoading={isSubmitting}
                />
            )}

            {mode === "inspection" && inspectionType === "equipamentos" && (
                <EquipmentForm 
                  initialData={initialData} 
                  onSubmit={handleSave} 
                  isLoading={isSubmitting}
                />
            )}

            {mode === "inspection" && inspectionType === "documentacao" && (
                <DocumentForm 
                  initialData={initialData} 
                  onSubmit={handleSave} 
                  isLoading={isSubmitting}
                />
            )}

            {mode === "inspection" && !["infraestrutura", "processos", "equipamentos", "documentacao"].includes(inspectionType) && inspectionType !== "" && (
                <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="font-medium text-slate-500">Módulo "{inspectionType}" em desenvolvimento.</p>
                    <Button variant="ghost" onClick={() => setStep(0)} className="mt-4">Voltar</Button>
                </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
