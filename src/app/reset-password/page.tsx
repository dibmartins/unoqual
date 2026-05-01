import { ResetPasswordForm } from "./reset-password-form";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mb-6 group transition-transform hover:scale-105 active:scale-95 duration-300">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 tracking-tight mb-2">Unoqual</h1>
          <p className="text-slate-500 font-medium tracking-wide">SOLUÇÃO EM QUALIDADE E DIMENSIONAMENTO</p>
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
