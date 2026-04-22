"use client";

import { motion } from "framer-motion";
import { Database, ClipboardCheck, FileCheck2 } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Mapeamento",
    description: "Cadastre os dados base da sua Facility (Unidade de Saúde), setores e perfis de pacientes.",
    color: "bg-blue-500"
  },
  {
    icon: ClipboardCheck,
    title: "Inspeção Guiada",
    description: "O RT usa checklists inteligentes e captura fotos criptografadas direto do dispositivo móvel.",
    color: "bg-blue-600"
  },
  {
    icon: FileCheck2,
    title: "Relatório Instantâneo",
    description: "Geração de laudos com trilha de auditoria, conformidade legal e assinatura digital.",
    color: "bg-blue-700"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#FBFBFA] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
            O Fluxo <span className="text-blue-600">Digitalizado</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Uma jornada pensada para a realidade da assistência, sem fricção e com máxima rastreabilidade.
          </p>
        </div>

        <div className="relative">
          {/* Linha Conectora (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 ${step.color} rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200 relative`}>
                  <step.icon className="w-10 h-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-sm border-2 border-slate-50">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
