"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Calculator, 
  Settings, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Painel Geral", icon: LayoutDashboard },
  { href: "/inspection/new", label: "Nova Inspeção", icon: ClipboardCheck },
  { href: "/staffing/new", label: "Dimensionamento", icon: Calculator },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function SidebarContent({ className, onItemClick }: { className?: string, onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-slate-900", className)}>
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-sm text-white">U</div>
        <span className="font-black text-xl tracking-tight text-white">Unoqual</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-colors min-h-[48px]",
                isActive 
                  ? "bg-blue-600 text-white font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5" />
                {link.label}
              </div>
              {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-xs text-slate-400 italic">v0.1</div>
          <div className="text-[10px] text-slate-500 font-medium leading-tight">
            © 2026 Unoqual<br/>Gestão Hospitalar
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 bg-slate-900 h-screen flex-col fixed left-0 top-0 border-r border-slate-800 z-20">
      <SidebarContent />
    </aside>
  );
}
