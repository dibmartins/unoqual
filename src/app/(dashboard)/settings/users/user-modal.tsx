"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { UserRole } from "@prisma/client";
import { useUserForm } from "./use-user-form";

export function UserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    formData,
    setFormData,
    isSubmitting,
    showPassword,
    setShowPassword,
    handleSubmit,
  } = useUserForm(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            Cadastrar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Defina o nome, e-mail e o perfil de acesso do novo colaborador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome Completo</Label>
              <Input
                id="user-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">E-mail Corporativo</Label>
              <Input
                id="user-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@organizacao.com.br"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">Perfil de Acesso</Label>
              <Select
                onValueChange={(val) => { if (val) setFormData({ ...formData, role: val as UserRole }); }}
                value={formData.role}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>
                    <div className="flex flex-col">
                      <span className="font-bold">Administrador</span>
                      <span className="text-[10px] text-slate-500">Acesso total às configurações e dados</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.GESTOR}>
                    <div className="flex flex-col">
                      <span className="font-bold">Gestor</span>
                      <span className="text-[10px] text-slate-500">Visualiza dashboards e relatórios das unidades</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.CONSULTOR}>
                    <div className="flex flex-col">
                      <span className="font-bold">Consultor</span>
                      <span className="text-[10px] text-slate-500">Realiza inspeções e coleta evidências</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 min-w-[120px]">
              {isSubmitting ? "Criando..." : "Salvar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
