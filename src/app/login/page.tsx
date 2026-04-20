"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 relative overflow-hidden">
      {/* Background Decorativo */}
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

        <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-slate-500">
              Entre com suas credenciais para gerenciar unidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ex: admin@unoqual.com"
                    className="h-11 border-slate-200 bg-white focus:ring-blue-500/20"
                    {...register("email")}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button variant="link" className="px-0 h-auto text-xs text-blue-600 hover:text-blue-700" type="button">
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="h-11 border-slate-200 bg-white focus:ring-blue-500/20"
                    {...register("password")}
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all hover:scale-[1.01] active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-slate-50 pt-6">
            <p className="text-center text-xs text-slate-400">
              Sistema Restrito para Consultores de Enfermagem
            </p>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-sm text-slate-400">
          Não tem uma conta?{" "}
          <Button variant="link" className="p-0 h-auto text-sm text-slate-600 font-semibold underline decoration-blue-500/30 underline-offset-4">
            Solicitar acesso
          </Button>
        </p>
      </div>
    </div>
  );
}
