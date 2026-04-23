"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserPlus, Mail, Shield, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserModal } from "./user-modal";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GESTOR" | "CONSULTOR";
  createdAt: Date;
};

export function UsersList({ initialUsers }: { initialUsers: User[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = initialUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Administrador</Badge>;
      case "GESTOR":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Gestor</Badge>;
      case "CONSULTOR":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Consultor</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 border-b p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Equipe e Usuários
            </CardTitle>
            <CardDescription className="text-sm">Gerencie quem tem acesso ao sistema e seus níveis de permissão</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto h-12 sm:h-11 font-bold">
            <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-slate-50/30">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nome ou e-mail..." 
              className="pl-10 bg-white h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-slate-700 whitespace-nowrap">Nome</TableHead>
                <TableHead className="font-bold text-slate-700 whitespace-nowrap">E-mail</TableHead>
                <TableHead className="font-bold text-slate-700 whitespace-nowrap">Perfil</TableHead>
                <TableHead className="font-bold text-slate-700 whitespace-nowrap">Data de Cadastro</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500 italic">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 whitespace-nowrap">{user.name}</TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Mail className="w-3 h-3 opacity-50" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Card>
  );
}
