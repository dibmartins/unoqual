"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Loader2 } from "lucide-react";
import { register } from "@/app/actions/auth";

export function OnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const userName = formData.get("userName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const orgName = formData.get("orgName") as string;
    const orgCnpj = formData.get("orgCnpj") as string;

    const result = await register({
      userName,
      email,
      passwordHash: password,
      orgName,
      orgCnpj,
    });

    if (result.success) {
      // Login automático após registro
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Cadastro realizado, mas erro ao fazer login. Vá para a página de login.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(result.error || "Erro ao realizar cadastro.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl border-slate-100">
      <CardHeader className="space-y-1 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-black">Blindar Minha Unidade</CardTitle>
        <CardDescription>
          Comece agora sua jornada para a conformidade digital.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome da Unidade / Hospital</Label>
              <Input id="orgName" name="orgName" placeholder="Ex: Hospital Central" required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgCnpj">CNPJ</Label>
              <Input id="orgCnpj" name="orgCnpj" placeholder="00.000.000/0000-00" required disabled={isLoading} />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          <div className="space-y-2">
            <Label htmlFor="userName">Seu Nome Completo</Label>
            <Input id="userName" name="userName" placeholder="Como quer ser chamado?" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail Profissional</Label>
            <Input id="email" name="email" type="email" placeholder="nome@hospital.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required disabled={isLoading} />
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-lg rounded-xl" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Criando Acesso...
              </>
            ) : (
              "Finalizar Onboarding"
            )}
          </Button>
          
          <p className="text-center text-xs text-slate-500 mt-4">
            Ao clicar em finalizar, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
