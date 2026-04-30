"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { createUser } from "@/app/actions/settings";
import { toast } from "sonner";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const INITIAL_FORM: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: UserRole.CONSULTOR,
};

export function useUserForm(onClose: () => void) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await createUser({
      name: formData.name,
      email: formData.email,
      passwordHash: formData.password,
      role: formData.role,
    });

    if (res.success) {
      setFormData(INITIAL_FORM);
      onClose();
      router.refresh();
      toast.success("Usuário criado com sucesso!");
    } else {
      toast.error(res.error);
    }

    setIsSubmitting(false);
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    showPassword,
    setShowPassword,
    handleSubmit,
  };
}
