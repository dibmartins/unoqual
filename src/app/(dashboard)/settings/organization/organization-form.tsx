"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save } from "lucide-react";
import { updateOrganization } from "@/app/actions/settings";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Organization = {
  id: string;
  name: string;
  cnpj: string;
  address: string | null;
  phone: string | null;
  _count?: {
    facilities: number;
    users: number;
  }
};

export function OrganizationForm({ organization }: { organization: Organization }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 border-b p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Dados da Organização
            </CardTitle>
            <CardDescription className="text-sm">Informações principais da instituição</CardDescription>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2 bg-white border rounded-lg shadow-sm">
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Unidades</div>
              <div className="text-lg sm:text-xl font-black text-blue-600">{organization._count?.facilities || 0}</div>
            </div>
            <div className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2 bg-white border rounded-lg shadow-sm">
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Usuários</div>
              <div className="text-lg sm:text-xl font-black text-blue-600">{organization._count?.users || 0}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Nome da Instituição / Razão Social</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Secretaria Municipal de Saúde"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-sm font-semibold">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
                required
                inputMode="numeric"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">Telefone de Contato</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 0000-0000"
                inputMode="tel"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold">Endereço Principal</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="h-11"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-12 sm:h-11 px-8 font-bold">
              {isSubmitting ? "Salvando..." : (
                <>
                  <Save className="w-5 h-5 mr-2" /> Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
