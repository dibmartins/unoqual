"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPassword } from "@/app/actions/auth";
import Link from "next/link";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!token) {
      setError("Token de recuperação ausente.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await resetPassword(token, password);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(result.error || "Erro ao redefinir senha.");
    }
    setIsLoading(false);
  }

  if (!token) {
    return (
      <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm p-6 text-center">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Link de recuperação inválido ou incompleto.</AlertDescription>
        </Alert>
        <Link href="/forgot-password" className="text-sm font-semibold text-blue-600">
          Solicitar novo link
        </Link>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight mb-2">Senha Redefinida!</CardTitle>
        <CardDescription className="text-slate-500 mb-6">
          Sua senha foi atualizada com sucesso. Você será redirecionado para a tela de login em instantes.
        </CardDescription>
        <Button onClick={() => router.push("/login")} className="w-full bg-blue-600">
          Ir para Login Agora
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Nova Senha</CardTitle>
        <CardDescription className="text-slate-500">
          Escolha uma senha segura para acessar sua conta.
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
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-200 bg-white focus:ring-blue-500/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 border-slate-200 bg-white focus:ring-blue-500/20"
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
                Atualizando Senha...
              </>
            ) : (
              "Alterar Senha"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
