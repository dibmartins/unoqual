"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrganization } from "@/app/actions/settings";
import { toast } from "sonner";

type OrganizationFormData = {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
};

type Organization = {
  id: string;
  name: string;
  cnpj: string;
  address: string | null;
  phone: string | null;
};

export function useOrganizationForm(organization: Organization) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: organization.name,
    cnpj: organization.cnpj,
    address: organization.address || "",
    phone: organization.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await updateOrganization(organization.id, formData);

    if (res.success) {
      router.refresh();
      toast.success("Dados atualizados com sucesso!");
    } else {
      toast.error(res.error);
    }

    setIsSubmitting(false);
  };

  return { formData, setFormData, isSubmitting, handleSubmit };
}
