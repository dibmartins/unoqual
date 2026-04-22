"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Unoqual</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Funcionalidades</Link>
          <Link href="#how-it-works" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Como Funciona</Link>
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Entrar</Link>
          <Link href="/onboarding">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6">
              Testar Agora
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
