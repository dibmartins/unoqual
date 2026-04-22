"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="px-6 py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                U
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Unoqual</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              A plataforma definitiva para automação de auditorias e dimensionamento de enfermagem.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Produto</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Funcionalidades</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Staffing Engine</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Relatórios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legislativo</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Cofen 242/2000</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Anvisa RDC 50</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Anvisa RDC 63</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacidade</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Segurança</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2026 Unoqual. Rigor técnico a serviço da gestão.</p>
          <div className="flex gap-6">
            <span>🇧🇷 PT-BR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
