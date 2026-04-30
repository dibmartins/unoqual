---
name: unoqual-architecture
description: >
  Use este skill ao criar, revisar ou refatorar qualquer arquivo no projeto Unoqual.
  Ele define os padrões obrigatórios de arquitetura, organização de código e boas práticas
  estabelecidos para manter o projeto coeso, simples, testável e de fácil manutenção.
---

# Arquitetura e Padrões do Projeto Unoqual

## Stack

- **Framework**: Next.js (App Router) — leia `node_modules/next/dist/docs/` antes de escrever código
- **Linguagem**: TypeScript (strict mode)
- **Banco de dados**: PostgreSQL via Prisma ORM
- **UI**: Componentes em `src/components/ui/` (shadcn/base-ui)
- **Notificações**: Sonner (`toast.success`, `toast.error`, `toast.warning`)
- **Formulários**: `react-hook-form` + `zod` para validação
- **Autenticação**: NextAuth + `requireUserSession()` de `@/lib/session`

---

## 1. Separação de Responsabilidades

### Regra Fundamental
Cada arquivo tem **uma única responsabilidade**. Nunca misture lógica de negócio, acesso a banco e JSX no mesmo arquivo.

### Camadas da Aplicação

```
src/
├── app/
│   ├── (dashboard)/          # Páginas — apenas composição e busca de dados
│   ├── actions/              # Server Actions — ponte entre UI e serviços
│   └── api/                  # Rotas de API (NextAuth, webhooks)
├── components/               # Componentes React — apenas JSX e event bindings
├── hooks/                    # Custom hooks — estado e handlers
├── services/                 # Lógica de negócio e acesso ao Prisma
└── lib/
    ├── constants/            # Constantes e enums compartilhados
    ├── errors.ts             # Tipos de erro padronizados
    ├── prisma.ts             # Singleton do cliente Prisma
    ├── session.ts            # requireUserSession()
    └── translations.ts       # Mapeamento de labels
```

---

## 2. Custom Hooks — Padrão Obrigatório

**Todo estado e handler** de um componente deve viver em um custom hook. Sem exceções de tamanho.

### Convenção de nomes e localização

O hook fica **junto ao componente** que o usa:

```
src/app/(dashboard)/settings/users/
├── user-modal.tsx          ← apenas JSX
└── use-user-form.ts        ← estado + handlers

src/components/inspection/hub/
├── verification-hub.tsx    ← apenas JSX
└── use-verification-hub.ts ← estado + handlers
```

### Estrutura do hook

```ts
// use-user-form.ts
"use client";

export function useUserForm(onClose: () => void) {
  // 1. Estado
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handlers
  const handleSubmit = async (e: React.FormEvent) => { ... };

  // 3. Retorno explícito e tipado
  return { isSubmitting, handleSubmit };
}
```

### Componente resultante

```tsx
// user-modal.tsx
"use client";
import { useUserForm } from "./use-user-form";

export function UserModal({ onClose }: Props) {
  const { formData, isSubmitting, handleSubmit } = useUserForm(onClose);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 3. Acesso ao Banco de Dados

### ❌ Proibido
```tsx
// page.tsx — ERRADO: query direta ao Prisma em página ou componente
import prisma from "@/lib/prisma";
const facilities = await prisma.facility.findMany({ ... });
```

### ✅ Correto
```tsx
// page.tsx — CORRETO: usa a Server Action encapsulada
import { getFacilities } from "@/app/actions/inspection";
const facilities = await getFacilities();
```

### Hierarquia de acesso a dados

```
Página (page.tsx)
  └── chama Server Action (actions/*.ts)
        └── chama Service (services/*.ts)
              └── acessa Prisma diretamente
```

O Prisma **só deve aparecer** em `src/services/` e `src/app/actions/` (quando não houver service correspondente).

---

## 4. Constantes e Tipos

### ❌ Proibido
```tsx
// component.tsx — ERRADO: dados estáticos longos inline
const SECTOR_GROUPS = [
  { label: "UTI", options: [...] }, // 80 linhas
];
```

### ✅ Correto
```ts
// src/lib/constants/sectors.ts
export const SECTOR_GROUPS: SectorGroup[] = [...];

// component.tsx
import { SECTOR_GROUPS } from "@/lib/constants/sectors";
```

### Regra para tipos e enums

Sempre use os **enums do Prisma** em vez de union types hardcoded:

```ts
// ❌ Errado
role: "ADMIN" | "GESTOR" | "CONSULTOR"

// ✅ Correto
import { UserRole } from "@prisma/client";
role: UserRole
```

Constantes compartilhadas entre múltiplos arquivos vão em `src/lib/constants/`.
Constantes de domínio de inspeção: `src/lib/constants/inspection.ts`
Constantes de setores hospitalares: `src/lib/constants/sectors.ts`

---

## 5. Server Actions

Toda action deve:
1. Chamar `requireUserSession()` como primeira operação
2. Delegar a lógica para um `Service` (quando existir)
3. Retornar `ActionResponse<T>` tipado
4. Capturar erros e retornar `{ success: false, error: string }`

```ts
// actions/settings.ts
"use server";
import { requireUserSession } from "@/lib/session";
import { ActionResponse } from "@/lib/errors";

export async function createFacility(data: CreateFacilityInput): Promise<ActionResponse> {
  try {
    const session = await requireUserSession();
    await FacilityService.create({ ...data, organizationId: session.user.organizationId });
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: "Falha ao criar unidade" };
  }
}
```

---

## 6. Formulários

Formulários simples (≤4 campos): `useState` + `handleSubmit` no hook customizado.

Formulários complexos (validações, dependências): `react-hook-form` + `zod` — o schema e o hook `useForm` ficam no hook customizado do componente:

```ts
// use-login-form.ts
export const loginSchema = z.object({ ... });

export function useLoginForm() {
  const form = useForm({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (data) => { ... };
  return { form, onSubmit };
}
```

---

## 7. Feedback ao Usuário

Sempre use Sonner para feedback. Nunca use `alert()`, `confirm()` ou `console.log` em produção.

```ts
toast.success("Operação concluída!");
toast.error(res.error ?? "Erro inesperado.");
toast.warning("Preencha todos os campos.");
toast.info("Aguarde...");
```

---

## 8. Checklist de Code Review

Ao revisar ou criar código, verifique:

- [ ] O componente contém apenas JSX e bindings?
- [ ] Todo estado e handler estão num hook `use-*.ts` co-localizado?
- [ ] Nenhuma query Prisma está diretamente em `page.tsx` ou componentes?
- [ ] Enums do Prisma são usados em vez de union types hardcoded?
- [ ] Constantes longas (>10 linhas) estão em `src/lib/constants/`?
- [ ] Actions chamam `requireUserSession()` antes de qualquer operação?
- [ ] Feedback ao usuário usa Sonner (`toast.*`)?
- [ ] Erros de `ActionResponse` são tratados com `toast.error(res.error)`?
