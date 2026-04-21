"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save } from "lucide-react";
import { updateOrganization } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

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
      alert("Dados atualizados com sucesso!");
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Dados da Organização
            </CardTitle>
            <CardDescription>Informações principais da instituição</CardDescription>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-white border rounded-lg shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Unidades</div>
              <div className="text-xl font-black text-blue-600">{organization._count?.facilities || 0}</div>
            </div>
            <div className="text-center px-4 py-2 bg-white border rounded-lg shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Usuários</div>
              <div className="text-xl font-black text-blue-600">{organization._count?.users || 0}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Instituição / Razão Social</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Secretaria Municipal de Saúde"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone de Contato</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço Principal</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - UF"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Salvando..." : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
