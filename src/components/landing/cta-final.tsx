"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CTAFinal() {
  return (
    <section className="py-24 bg-blue-900 relative overflow-hidden">
      {/* Elementos Decorativos */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-10 shadow-2xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
            Sua próxima fiscalização pode acontecer amanhã. <br/>
            <span className="text-blue-400">O seu RT está preparado?</span>
          </h2>
          
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto font-medium">
            Junte-se a unidades de saúde que já digitalizaram sua conformidade e economizam centenas de horas em auditorias.
          </p>
          
          <Link href="/onboarding">
            <Button size="lg" className="h-16 px-12 bg-white text-blue-900 hover:bg-blue-50 font-black text-xl rounded-2xl shadow-2xl transition-all hover:scale-[1.05] active:scale-95">
              Blindar minha Unidade Agora
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
