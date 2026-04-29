"use client";

import { useState, useEffect } from "react";
import { Plus, ClipboardCheck, Calculator, Save, Building2, User, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ItemCard } from "./item-card";
import { FormManagerModal } from "../modals/form-manager-modal";
import { 
  upsertInspectionAction, 
  deleteEntryAction, 
  finalizeInspectionAction,
  getInspectionWithEntries 
} from "@/app/actions/inspection";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Facility {
  id: string;
  name: string;
  departments: { id: string; name: string }[];
}

export function VerificationHub({ 
  facilities,
  initialInspectionId
}: { 
  facilities: Facility[],
  initialInspectionId?: string
}) {
  const router = useRouter();
  const [inspectionId, setInspectionId] = useState<string | null>(initialInspectionId || null);
  const [facilityId, setFacilityId] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [modalMode, setModalMode] = useState<"staffing" | "inspection" | null>(null);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const selectedFacility = facilities.find(f => f.id === facilityId);

  // Load existing inspection metadata if ID is provided
  useEffect(() => {
    async function loadExisting() {
      if (initialInspectionId) {
        const res = await getInspectionWithEntries(initialInspectionId);
        if (res) {
          setFacilityId(res.facilityId);
          setEntries(res.entries);
        }
      }
    }
    loadExisting();
  }, [initialInspectionId]);

  // Initialize or reload inspection
  async function ensureInspection(newFacilityId: string) {
    if (!inspectionId && newFacilityId) {
      const res = await upsertInspectionAction({
        facilityId: newFacilityId,
        inspectorId: "system-user",
      });
      if (res.success && res.data?.id) {
        setInspectionId(res.data.id);
      }
    }
  }

  async function refreshData() {
    if (inspectionId) {
      const res = await getInspectionWithEntries(inspectionId);
      if (res) {
        setEntries(res.entries);
      }
    }
  }

  useEffect(() => {
    if (inspectionId) refreshData();
  }, [inspectionId]);

  const handleAddItem = (mode: "staffing" | "inspection") => {
    if (!facilityId) {
      toast.warning("Selecione uma unidade para começar.");
      return;
    }
    if (!inspectionId) {
      toast.info("Aguarde a inicialização da inspeção. Tente novamente em alguns segundos.");
      return;
    }
    setModalMode(mode);
    setEditingEntry(null);
  };

  const handleFinish = async () => {
    if (!inspectionId) return;
    setIsFinishing(true);
    const res = await finalizeInspectionAction(inspectionId);
    if (res.success) {
      router.push("/dashboard");
    } else {
      toast.error(res.error);
      setIsFinishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja remover este item?")) {
      const res = await deleteEntryAction(id);
      if (res.success) refreshData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-slate-900">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <ClipboardCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            Nova Visita Técnica
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Gestão Integrada de Verificações e Dimensionamento</p>
        </div>
        
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
          {inspectionId ? `ID: ${inspectionId.split('-')[0]}` : "Novo Rascunho"}
        </Badge>
      </div>

      {/* Configurações Globais */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unidade de Saúde</Label>
            <Select 
              onValueChange={(val) => {
                if (val) {
                  setFacilityId(val);
                  ensureInspection(val);
                }
              }} 
              value={facilityId}
              disabled={!!inspectionId && entries.length > 0}
            >
              <SelectTrigger className="h-12 bg-white border-slate-200 hover:border-slate-300 transition-colors">
                <SelectValue placeholder="Selecione a Unidade...">
                  {facilities.find(f => f.id === facilityId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!!inspectionId && entries.length > 0 && (
              <p className="text-[10px] text-amber-600 font-medium">Não é possível alterar a unidade apó adicionarmos itens.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Inspetor Responsável</Label>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 shadow-sm h-12">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="font-semibold text-slate-700 text-sm">Diego Martins</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <Button 
            variant="outline" 
            className="h-28 sm:h-32 border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 group flex flex-col gap-3 rounded-2xl transition-all shadow-sm"
            onClick={() => handleAddItem("staffing")}
          >
            <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform group-hover:bg-emerald-100">
              <Calculator className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="text-emerald-800 font-bold text-sm sm:text-base">Incluir Dimensionamento</div>
         </Button>

         <Button 
            variant="outline" 
            className="h-28 sm:h-32 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 group flex flex-col gap-3 rounded-2xl transition-all shadow-sm"
            onClick={() => handleAddItem("inspection")}
          >
            <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform group-hover:bg-blue-100">
              <ClipboardCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="text-blue-800 font-bold text-sm sm:text-base">Incluir Inspeção de Setor</div>
         </Button>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Itens Verificados
          </h2>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded-full px-3">{entries.length} itens</Badge>
        </div>

        {entries.length === 0 ? (
          <div className="py-16 sm:py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                <Plus className="w-8 h-8 text-slate-300" />
              </div>
            </div>
            <p className="text-slate-500 font-bold text-lg mb-1">Lista Vazia</p>
            <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
              Selecione uma unidade acima e adicione dimensionamentos ou verificações.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <ItemCard
                key={entry.id}
                type={entry.type}
                checklistItemKey={entry.checklistItemKey}
                complianceStatus={entry.complianceStatus}
                departmentName={entry.department?.name}
                metadata={entry.metadata}
                onEdit={() => {
                  setEditingEntry(entry);
                  setModalMode(entry.type === "staffing" ? "staffing" : "inspection");
                }}
                onDelete={() => handleDelete(entry.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Inferior */}
      <div className="pt-6 mt-4 flex justify-end">
        <Button 
          className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 text-lg font-bold flex items-center justify-center gap-3 rounded-xl transition-all disabled:opacity-50 disabled:shadow-none"
          disabled={!inspectionId || entries.length === 0 || isFinishing}
          onClick={handleFinish}
        >
          {isFinishing ? "Processando..." : (
            <>
              <Save className="w-5 h-5" />
              Finalizar Auditoria
            </>
          )}
        </Button>
      </div>

      {selectedFacility && (
        <FormManagerModal
          isOpen={modalMode !== null}
          onClose={() => setModalMode(null)}
          mode={modalMode}
          inspectionId={inspectionId!}
          facility={selectedFacility}
          initialData={editingEntry}
          onSuccess={() => {
            setModalMode(null);
            refreshData();
          }}
          existingEntries={entries}
        />
      )}
    </div>
  );
}
