import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Se já estiver logado, redireciona para o dashboard
  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
