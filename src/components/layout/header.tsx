"use client"

import { User, LogOut, Settings, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between lg:justify-end px-4 sm:px-8 sticky top-0 z-10">
      <div className="flex lg:hidden items-center gap-4">
        <MobileNav />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-xs text-white">U</div>
          <span className="font-black text-lg tracking-tight text-slate-900">Unoqual</span>
        </div>
      </div>
      
      <div className="ml-auto lg:ml-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors outline-none group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 group-data-[open]:text-blue-600 transition-colors">
                {user?.name || "Usuário"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
                <Shield className="w-2.5 h-2.5" />
                {user?.role || "Consultor"}
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-data-[open]:border-blue-200 group-data-[open]:bg-blue-50 transition-colors">
              <User className="w-5 h-5 text-slate-500 group-data-[open]:text-blue-600" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <div className="px-3 py-2 sm:hidden border-b border-slate-100 mb-1">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="w-4 h-4 text-slate-500" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => window.location.href = '/settings'}>
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Configurações</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
