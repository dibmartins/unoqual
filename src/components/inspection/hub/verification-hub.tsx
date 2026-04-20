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

interface Facility {
  id: string;
  name: string;
  departments: { id: string; name: string }[];
}

export function VerificationHub({ facilities }: { facilities: Facility[] }) {
  const router = useRouter();
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [facilityId, setFacilityId] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [modalMode, setModalMode] = useState<"staffing" | "inspection" | null>(null);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const selectedFacility = facilities.find(f => f.id === facilityId);

  // Initialize or reload inspection
  async function ensureInspection() {
    if (!inspectionId && facilityId) {
      const res = await upsertInspectionAction({
        facilityId,
        inspectorId: "system-user",
      });
      if (res.success && res.id) {
        setInspectionId(res.id);
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
      alert("Selecione uma unidade para começar.");
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
      alert(res.error);
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
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
            <ClipboardCheck className="w-10 h-10 text-blue-600" />
            Nova Visita Técnica
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Gestão Integrada de Verificações e Dimensionamento</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
            {inspectionId ? `ID: ${inspectionId.split('-')[0]}` : "Novo Rascunho"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Configurações Globais */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">Unidade de Saúde</Label>
                <Select 
                  onValueChange={(val) => {
                    if (val) {
                      setFacilityId(val);
                      ensureInspection();
                    }
                  }} 
                  value={facilityId}
                  disabled={!!inspectionId && entries.length > 0}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">Inspetor Responsável</Label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-slate-50/50 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Diego Martins</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-base font-bold flex items-center justify-center gap-2"
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

        {/* Main Feed: Itens de Inspeção */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Button 
                variant="outline" 
                className="h-28 border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 group flex flex-col gap-2 rounded-2xl transition-all"
                onClick={() => handleAddItem("staffing")}
              >
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="text-emerald-800 font-bold">Incluir Dimensionamento</div>
             </Button>

             <Button 
                variant="outline" 
                className="h-28 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 group flex flex-col gap-2 rounded-2xl transition-all"
                onClick={() => handleAddItem("inspection")}
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div className="text-blue-800 font-bold">Incluir Inspeção de Setor</div>
             </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Itens Verificados</h2>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600">{entries.length} itens</Badge>
            </div>

            {entries.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                <div className="flex justify-center mb-4">
                  <Plus className="w-12 h-12 text-slate-200" />
                </div>
                <p className="text-slate-400 font-medium">Nenhum item adicionado à inspeção ainda.</p>
                <p className="text-slate-300 text-sm">Adicione dimensionamentos ou veriticações acima.</p>
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
        </div>
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
