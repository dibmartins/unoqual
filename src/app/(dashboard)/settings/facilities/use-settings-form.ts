"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFacility, createDepartment } from "@/app/actions/settings";
import { toast } from "sonner";

type FacilityWithDepts = {
  id: string;
  name: string;
  address?: string | null;
  departments: { id: string; name: string; classification?: string | null; hasNursing: boolean }[];
};

export function useSettingsForm(initialFacilities: FacilityWithDepts[]) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Facility form
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityAddress, setNewFacilityAddress] = useState("");

  // Department form
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    initialFacilities[0]?.id || null
  );
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentClassification, setNewDepartmentClassification] = useState("");
  const [newDepartmentHasNursing, setNewDepartmentHasNursing] = useState(true);

  const selectedFacility = initialFacilities.find((f) => f.id === selectedFacilityId);

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName) return;

    setIsSubmitting(true);
    const res = await createFacility({ name: newFacilityName, address: newFacilityAddress });
    if (res.success) {
      setNewFacilityName("");
      setNewFacilityAddress("");
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsSubmitting(false);
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentName || !selectedFacilityId || !newDepartmentClassification) {
      toast.warning("Por favor, preencha o nome e o tipo do setor.");
      return;
    }

    setIsSubmitting(true);
    const res = await createDepartment({
      facilityId: selectedFacilityId,
      name: newDepartmentName,
      classification: newDepartmentClassification,
      hasNursing: newDepartmentHasNursing,
    });

    if (res.success) {
      setNewDepartmentName("");
      setNewDepartmentClassification("");
      setNewDepartmentHasNursing(true);
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsSubmitting(false);
  };

  return {
    isSubmitting,
    newFacilityName, setNewFacilityName,
    newFacilityAddress, setNewFacilityAddress,
    selectedFacilityId, setSelectedFacilityId,
    newDepartmentName, setNewDepartmentName,
    newDepartmentClassification, setNewDepartmentClassification,
    newDepartmentHasNursing, setNewDepartmentHasNursing,
    selectedFacility,
    handleCreateFacility,
    handleCreateDepartment,
  };
}
