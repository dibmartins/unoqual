# Unoqual - Gestão de Qualidade Hospitalar

SaaS de gestão de qualidade, dimensionamento e conformidade hospitalar.

## 🚀 Stack Tecnológica

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/UI](https://ui.shadcn.com/)
- **Banco de Dados**: [PostgreSQL (Neon)](https://neon.tech/)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)

## 🛠️ Pré-requisitos

- **Node.js**: v20.0.0 ou superior
- **Gerenciador de Pacotes**: [pnpm](https://pnpm.io/) v10+

## ⚙️ Configuração Inicial

1. **Clone o repositório:**
   ```bash
   git clone <repo-url>
   cd unoqual
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto (use as credenciais em `docs/stack/secrets/neon.env` para desenvolvimento):

   ```env
   DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
   NEXTAUTH_SECRET="seu-segredo-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Prepare o banco de dados:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

## 💻 Comandos Úteis

- `pnpm dev`: Inicia o servidor de desenvolvimento.
- `pnpm build`: Cria o build de produção.
- `pnpm start`: Inicia o servidor de produção.
- `pnpm lint`: Executa a verificação do linter.
- `npx prisma studio`: Abre a interface visual para o banco de dados.

## 📦 Módulos Ativos

- **Dashboard**: Visão geral de métricas e listagem de inspeções recentes.
- **Inspeções**: Sistema de formulários dinâmicos (Iniciado com Infraestrutura RDC 50).
- **Dimensionamento**: (Em desenvolvimento - aguardando integração).

## 🏗️ Arquitetura do Projeto

O projeto segue uma estrutura **Facility-Centric**:
- `Organizations`: Clientes do SaaS (Hospitais, Redes).
- `Facilities`: Unidades físicas do hospital.
- `Departments`: Setores dentro de cada unidade (UTI, Pronto Socorro, etc).

Regras de desenvolvimento:
- **I18n**: Código e banco de dados em **Inglês**; Interface (UI) em **Português**.
- **Traduções**: Use `src/lib/translations.ts` para centralizar rótulos de interface.

## 📂 Documentação

Consulte a pasta `/docs` para especificações detalhadas:
- `docs/produto/`: Requisitos, terminologia e formulários.
- `docs/stack/`: Definições técnicas e guias de infraestrutura.
