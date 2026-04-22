import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Calculator, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Painel Geral", icon: LayoutDashboard },
    { href: "/inspection/new", label: "Nova Inspeção", icon: ClipboardCheck },
    { href: "/staffing/new", label: "Dimensionamento", icon: Calculator },
    { href: "/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-sm">U</div>
        <span className="font-black text-xl tracking-tight">Unoqual</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium"
              }`}
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
    </aside>
  );
}
