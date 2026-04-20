# Arquitetura do Projeto

Este documento descreve a arquitetura técnica, refletindo a implementação estabelecida e as escolhas modernas de stack de desenvolvimento.

### Resumo de Entendimento
- **O que está sendo construído:** Uma plataforma SaaS chamada Unoqual (Sistema de Gestão de Qualidade Hospitalar) para digitalizar inspeções hospitalares, avaliar matrizes de risco e gerar relatórios instantaneamente.
- **Por que existe:** Para eliminar cerca de 35 horas de redação manual de relatórios por hospital, automatizando cálculos e padronizando processos em conformidade com normas regulatórias.
- **Para quem é:** Consultores Técnicos (que inserem os dados) e Gestores Hospitalares (que acessam um Portal do Cliente para visualizar *dashboards* e baixar relatórios).
- **Principais restrições:** A plataforma deve impor um rigoroso isolamento entre clientes (*multi-tenancy*), manter *logs* de auditoria abrangentes e criptografar dados sensíveis desde o primeiro dia.
- **Não-objetivos explícitos:** Funcionalidades *offline* (sincronização/armazenamento *offline* via PWA) estão estritamente fora do escopo do MVP V1 para priorizar a velocidade de lançamento no mercado (*speed to market*).

### Premissas
- **Escala e Hospedagem:** Projetado inicialmente para 1 a 5 consultores e <20 unidades hospitalares. Uma configuração de hospedagem enxuta (Vercel + Banco de Dados Gerenciado como Neon/Supabase + S3 para imagens) é suficiente.
- **Escopo do MVP:** O lançamento inicial foca exclusivamente no módulo de "Inspeções".

---

## 🚀 Stack Tecnológica

O projeto utiliza uma stack de ponta e de alta performance:

- **Frontend:** Next.js 16 (App Router) com React 19, utilizando Server Components e Actions.
- **Estilização:** Tailwind CSS 4 com configuração nativa *CSS-first* e Shadcn/UI.
- **Camada de Banco de Dados:** Prisma 6 atuando como o ORM type-safe para um banco de dados PostgreSQL gerenciado pela Neon.
- **Autenticação:** NextAuth.js 4 gerenciando sessões seguras com Controle de Acesso Baseado em Funções (RBAC).
- **Ambiente:** Implantado e gerenciado via Vercel com Neon para Postgres serverless.
- **Gerenciador de Pacotes:** `pnpm`
- **Armazenamento de Imagens:** AWS S3 (ou compatível como Cloudflare R2). O *frontend* solicita URLs pré-assinadas (*pre-signed URLs*) seguras para fazer o *upload* das fotos de inspeção diretamente pelo navegador, contornando os limites das funções *serverless*.

---

## Estratégia de Testes e Garantia de Qualidade (QA)
- **Testes Unitários da Lógica Central:** Fórmulas serão isoladas como funções TypeScript puras e agnósticas de *framework*. Testes unitários abrangentes (Jest/Vitest) garantirão extrema precisão para todos os limites matemáticos.
- **Testes E2E (Ponta a Ponta):** Os testes em Playwright terão como alvo os "Caminhos Felizes" (*Happy Paths*) críticos: entrada de dados pelo Consultor e *download* de relatórios pelo Gestor.
- **Deployment:** A integração da Vercel com o GitHub acionará Ambientes de Pré-visualização Automáticos (*Automatic Preview Environments*), executando todos os testes matemáticos isolados de forma segura antes de qualquer *merge* de código para produção.

---

## 🔐 Política de Segurança e LGPD

Medidas de segurança atuais e planejadas:

- **Controle de Acesso:** Isolamento rigoroso de inquilinos (*tenant isolation*). Os consultores e gestores só podem visualizar e editar dados dos hospitais aos quais estão formalmente vinculados.
- **Minimização de Dados:** Seguindo os princípios da LGPD, armazenamos os níveis de complexidade dos pacientes sem PII (Informações de Identificação Pessoal).
- **Proteção de Evidências:** Fotos das inspeções são armazenadas em bucket compatível com S3. O acesso é restrito através de URLs assinadas temporárias vinculadas a sessões autenticadas.
- **Digital Signature:** Cada inspeção finalizada deve gerar um hash (SHA-256) do conteúdo e armazenar o user_agent e ip_address do consultor no momento da submissão.
- **Criptografia de Imagens:** Como fotos de hospitais podem conter rostos de pacientes ou dados em prontuários (mesmo que acidentalmente), as imagens no bucket S3 não devem ser públicas. Use S3 Managed Keys (SSE-S3) e acesso via Pre-signed URLs com validade de 5 minutos.

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