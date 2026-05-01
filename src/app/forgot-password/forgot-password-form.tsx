"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordReset } from "@/app/actions/auth";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await requestPasswordReset(email);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "Ocorreu um erro ao processar sua solicitação.");
    }
    setIsLoading(false);
  }

  if (isSuccess) {
    return (
      <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight mb-2">E-mail Enviado</CardTitle>
        <CardDescription className="text-slate-500 mb-6">
          Se o e-mail <strong>{email}</strong> estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha em instantes.
        </CardDescription>
        <Link href="/login" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Login
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Senha</CardTitle>
        <CardDescription className="text-slate-500">
          Informe seu e-mail para receber as instruções de recuperação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: admin@unoqual.com"
              className="h-11 border-slate-200 bg-white focus:ring-blue-500/20"
              autoComplete="email"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all hover:scale-[1.01] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando Link...
              </>
            ) : (
              "Enviar Instruções"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col border-t border-slate-50 pt-6">
        <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Login
        </Link>
      </CardFooter>
    </Card>
  );
}
