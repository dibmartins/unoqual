"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden bg-[#FBFBFA]">
      {/* Elementos Decorativos */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              CONFORMIDADE NORMATIVA DIGITAL
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              Automatize as Auditorias de Enfermagem da sua Unidade.
            </h1>
            
            <p className="text-xl text-slate-600 font-medium mb-4 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              De <span className="text-slate-900 font-bold">35 horas</span> para relatórios <span className="text-blue-600 font-bold italic">instantâneos</span>.
            </p>
            
            <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0">
              Garanta 100% de conformidade com as resoluções do Cofen e Anvisa. A plataforma definitiva para o 
              <span className="text-slate-900 font-semibold italic"> Nursing Director</span> gerenciar o 
              <span className="text-slate-900 font-semibold"> Staffing</span> e as inspeções sem retrabalho.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 group">
                  Testar na Minha Unidade
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Setup em 5 minutos
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            {/* Mockup do Tablet */}
            <div className="relative mx-auto w-full max-w-[550px] aspect-[4/3] bg-slate-900 rounded-[2.5rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-white">
                {/* Simulando Interface do App */}
                <div className="flex h-full">
                  <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-16 border-b border-slate-100 flex items-center px-6 justify-between">
                      <div className="w-32 h-4 bg-slate-100 rounded"></div>
                      <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="h-8 bg-slate-50 rounded w-1/2"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="w-1/2 h-2 bg-blue-200 rounded mb-2"></div>
                          <div className="w-3/4 h-4 bg-blue-600 rounded"></div>
                        </div>
                        <div className="h-24 bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <div className="w-1/2 h-2 bg-slate-200 rounded mb-2"></div>
                          <div className="w-3/4 h-4 bg-slate-400 rounded"></div>
                        </div>
                      </div>
                      <div className="h-40 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="w-24 h-2 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay de Reflexo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </div>

            {/* Badge Flutuante */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RELATÓRIO</p>
                  <p className="text-sm font-black text-slate-900">Gerado com Sucesso</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
