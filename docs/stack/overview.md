# Arquitetura do Projeto

Este documento descreve a arquitetura técnica, refletindo a implementação estabelecida e as escolhas modernas de stack de desenvolvimento.

---

## 🚀 Stack Tecnológica

O projeto utiliza uma stack de ponta e de alta performance:

- **Frontend:** Next.js 16 (App Router) com React 19, utilizando Server Components e Actions.
- **Estilização:** Tailwind CSS 4 com configuração nativa *CSS-first* e Shadcn/UI.
- **Camada de Banco de Dados:** Prisma 6 atuando como o ORM type-safe para um banco de dados PostgreSQL.
- **Autenticação:** NextAuth.js 4 gerenciando sessões seguras com Controle de Acesso Baseado em Funções (RBAC).
- **Ambiente:** Implantado e gerenciado via Vercel com Neon para Postgres serverless.

## 🔐 Política de Segurança e LGPD

Medidas de segurança atuais e planejadas:

- **Controle de Acesso:** Isolamento rigoroso de inquilinos (*tenant isolation*). Os consultores e gestores só podem visualizar e editar dados dos hospitais aos quais estão formalmente vinculados.
- **Minimização de Dados:** Seguindo os princípios da LGPD, armazenamos os níveis de complexidade dos pacientes sem PII (Informações de Identificação Pessoal).
- **Proteção de Evidências:** Fotos das inspeções são armazenadas em bucket compatível com S3. O acesso é restrito através de URLs assinadas temporárias vinculadas a sessões autenticadas.

---

## 🌐 Internacionalização e Localização (i18n)

O sistema segue um isolamento rigoroso entre a representação interna dos dados e a interface voltada para o usuário:

### Idioma Interno do Sistema (Inglês)
- Schemas de banco de dados, enums do Prisma (ex: `Severity`, `Discipline`, `FindingType`) e constantes de código devem estar sempre em **Inglês**.
- Isso garante a manutenibilidade da base de código, segue padrões globais e evita problemas com caracteres especiais.

### Interface do Usuário (Português - PT-BR)
- Todos os rótulos, indicadores de status, níveis de risco e tipos de achados mostrados ao usuário final **DEVEM** estar em Português.
- O mapeamento é tratado pelo utilitário centralizado `translate()` em `src/lib/translations.ts`. Esta é a única fonte de verdade (*single source of truth*).

### Sem Strings de Interface Hardcoded
> [!IMPORTANT]
> Evite operadores ternários parciais para tradução em componentes. Use sempre a função auxiliar `translate` para garantir a consistência em toda a aplicação.