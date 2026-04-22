"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, FileWarning, TrendingDown } from "lucide-react";

const pains = [
  {
    icon: Clock,
    title: "Dias perdidos em planilhas",
    description: "Cruzamento manual de dados de staffing com as resoluções do Cofen consome horas preciosas do RT.",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    icon: FileWarning,
    title: "Risco Jurídico e Sanitário",
    description: "Formulários de papel perdidos, ilegíveis ou incompletos são um perigo em fiscalizações.",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    icon: TrendingDown,
    title: "Falta de Visibilidade",
    description: "Impossibilidade de identificar gargalos estruturais e de processos em tempo real nas unidades.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  }
];

export function PainPoints() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold mb-6"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            O CUSTO DA INEFICIÊNCIA
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Você sabe quanto custa o tempo do seu <span className="text-blue-500">Technical Lead (RT)</span>?
          </h2>
          <p className="text-slate-400 text-lg">
            A gestão em saúde não pode mais depender de processos analógicos e decisões baseadas em suposições.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors group"
            >
              <div className={`w-14 h-14 ${pain.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <pain.icon className={`w-7 h-7 ${pain.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-4">{pain.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {pain.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
