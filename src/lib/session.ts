import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppError } from "@/lib/errors";

/**
 * Recupera a sessão atual de forma fortemente tipada.
 * Lança um AppError.unauthorized caso o usuário não esteja autenticado
 * ou não possua os campos obrigatórios (id, organizationId, role).
 *
 * Como as rotas já são protegidas pelo middleware, esta função atua como
 * uma garantia para o TypeScript e uma camada extra de segurança (Defense in Depth)
 * para Server Actions e Server Components.
 */
export async function requireUserSession(): Promise<Session> {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).organizationId || !(session.user as any).id) {
    throw AppError.unauthorized("Sessão inválida ou não autenticada.");
  }

  return session;
}
