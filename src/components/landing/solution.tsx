"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, CheckCircle } from "lucide-react";

export function Solution() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                A engenharia por trás da <span className="text-blue-600">conformidade</span>.
              </h2>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Reporting</h3>
                    <p className="text-slate-600 leading-relaxed">
                      O RT finaliza a inspeção no <span className="font-semibold italic">Ward</span> (Setor de Internação) 
                      e o laudo em PDF já está no seu e-mail, padronizado e pronto para auditoria.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Compliance Nativo</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Algoritmos de <span className="font-semibold">Staffing</span> (Dimensionamento de Pessoal) 
                      atualizados em tempo real com a legislação vigente (Cofen/Anvisa).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 p-4 shadow-2xl"
            >
              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <div className="h-12 bg-slate-900 flex items-center px-6 justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">LAUDO_INSPECAO_V2.PDF</div>
                  <div className="w-4" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-blue-600 rounded" />
                      <div className="w-32 h-2 bg-slate-200 rounded" />
                    </div>
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border-2 border-slate-100 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-1/2 h-2 bg-slate-200 rounded mb-2" />
                      <div className="w-3/4 h-3 bg-slate-300 rounded" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-1/2 h-2 bg-slate-200 rounded mb-2" />
                      <div className="w-3/4 h-3 bg-slate-300 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
