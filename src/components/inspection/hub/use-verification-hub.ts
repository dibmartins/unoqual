"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  upsertInspectionAction,
  deleteEntryAction,
  finalizeInspectionAction,
  getInspectionWithEntries,
} from "@/app/actions/inspection";
import { toast } from "sonner";

type ModalMode = "staffing" | "inspection" | null;

export function useVerificationHub(initialInspectionId?: string) {
  const router = useRouter();

  const [inspectionId, setInspectionId] = useState<string | null>(initialInspectionId || null);
  const [facilityId, setFacilityId] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);
  const [staffingCalculations, setStaffingCalculations] = useState<any[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [calculationModalOpen, setCalculationModalOpen] = useState(false);
  const [selectedCalculationEntry, setSelectedCalculationEntry] = useState<any>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const refreshData = async () => {
    if (!inspectionId) return;
    const res = await getInspectionWithEntries(inspectionId);
    if (res) {
      setEntries(res.entries);
      setStaffingCalculations((res as any).staffingCalculations || []);
    }
  };

  // Load existing inspection on mount
  useEffect(() => {
    async function loadExisting() {
      if (!initialInspectionId) return;
      const res = await getInspectionWithEntries(initialInspectionId);
      if (res) {
        setFacilityId(res.facilityId);
        setEntries(res.entries);
        setStaffingCalculations((res as any).staffingCalculations || []);
      }
    }
    loadExisting();
  }, [initialInspectionId]);

  // Reload when inspection ID becomes available
  useEffect(() => {
    if (inspectionId) refreshData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId]);

  const ensureInspection = async (newFacilityId: string) => {
    if (inspectionId || !newFacilityId) return;
    const res = await upsertInspectionAction({
      facilityId: newFacilityId,
      inspectorId: "system-user",
    });
    if (res.success && res.data?.id) {
      setInspectionId(res.data.id);
    }
  };

  const handleFacilityChange = (val: string) => {
    if (!val) return;
    setFacilityId(val);
    ensureInspection(val);
  };

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

  const handleCalculateItem = (entry: any) => {
    setSelectedCalculationEntry(entry);
    setCalculationModalOpen(true);
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setModalMode(entry.type === "staffing" ? "staffing" : "inspection");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja remover este item?")) return;
    const res = await deleteEntryAction(id);
    if (res.success) refreshData();
  };

  const handleFinish = async () => {
    if (!inspectionId) return;
    setIsFinishing(true);
    const res = await finalizeInspectionAction(inspectionId);
    if (res.success) {
      router.push("/inspections");
    } else {
      toast.error(res.error);
      setIsFinishing(false);
    }
  };

  const handleModalSuccess = () => {
    setModalMode(null);
    refreshData();
  };

  return {
    inspectionId,
    facilityId,
    entries,
    staffingCalculations,
    isFinishing,
    isFinalizeModalOpen, setIsFinalizeModalOpen,
    calculationModalOpen, setCalculationModalOpen,
    selectedCalculationEntry,
    modalMode, setModalMode,
    editingEntry,
    handleFacilityChange,
    handleAddItem,
    handleCalculateItem,
    handleEditEntry,
    handleDelete,
    handleFinish,
    handleModalSuccess,
  };
}
