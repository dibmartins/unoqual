import { User } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">Diego Martins</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gestor / Enfermeiro</p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
          <User className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
