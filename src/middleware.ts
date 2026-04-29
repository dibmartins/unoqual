import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => {
      // Retorna true somente se o token existir e possuir organizationId
      return !!token?.organizationId;
    },
  },
});

export const config = {
  // Protege todas as rotas internas, mas permite / (landing page), /login, api de auth, e arquivos públicos
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - (root) landing page
     * - api/auth (NextAuth routes)
     * - login (Login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, etc)
     */
    "/((?!$|api/auth|login|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
