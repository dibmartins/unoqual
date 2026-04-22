"use client";

import { motion } from "framer-motion";

const norms = [
  "COFEN 242/2000",
  "ANVISA RDC 50",
  "ANVISA RDC 63",
  "NBR 9050",
  "MS PORTARIA 529",
  "COFEN 543/2017"
];

export function SocialProof() {
  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
          Motor de regras parametrizado com as mais exigentes normas
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
          {[...norms, ...norms].map((norm, index) => (
            <div
              key={index}
              className="text-2xl md:text-3xl font-black text-slate-300 hover:text-blue-600 transition-colors cursor-default"
            >
              {norm}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
