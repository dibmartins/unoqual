# Plano de Segurança e Privacidade (LGPD) - Unoqual

Este documento detalha a arquitetura de segurança, isolamento de dados (multi-tenancy) e conformidade com a LGPD para a plataforma Unoqual.

## 1. Estratégia de Autenticação e Sessão

A aplicação utiliza **NextAuth.js** com a estratégia de **JSON Web Tokens (JWT)** para garantir escalabilidade e performance.

### 1.1 Claims Customizados no JWT
Para evitar consultas redundantes ao banco de dados, o token JWT deve conter:
- `user_id`: Identificador único do usuário.
- `organization_id`: Identificador da organização (Tenant) à qual o usuário pertence.
- `role`: Nível de acesso (ADMIN, GESTOR, CONSULTOR).

### 1.2 Fluxo de Autenticação
1. O usuário fornece credenciais via `/login`.
2. O backend valida o `email` e compara o hash da senha (utilizando **BCrypt** ou **Argon2**).
3. Após sucesso, o JWT é gerado e armazenado em um cookie `httpOnly`, `secure` e `SameSite=Lax`.

## 2. Multi-tenancy (Isolamento de Dados)

O isolamento é implementado logicamente via **Shared Database, Separate Schemas (Logical)**.

### 2.1 Garantia de Isolamento
Todas as queries ao banco de dados (Prisma) **devem** incluir o filtro de organização:
```typescript
// Exemplo de busca de inspeções
const inspections = await prisma.inspection.findMany({
  where: {
    facility: {
      organizationId: session.user.organizationId
    }
  }
});
```

### 2.2 Middleware de Segurança
Implementar um Middleware em nível de API ou Server Actions que intercepte as requisições e valide se o `organization_id` solicitado corresponde ao `organization_id` presente no JWT do usuário.

## 3. Trilha de Auditoria (Audit Trail)

Para conformidade e validade técnica dos laudos, toda alteração em dados sensíveis deve ser registrada.

### 3.1 Implementação
- **Campos Obrigatórios:** `created_by`, `updated_by` (FK para User) e timestamps em todas as tabelas principais.
- **Log de Alterações:** Utilizar uma tabela de `AuditLogs` ou um mecanismo de *Soft Delete* para manter o histórico de versões de formulários críticos (ex: Sala Vermelha, Dimensionamento).

## 4. Proteção de Evidências e Arquivos

Fotos de infraestrutura e documentos anexados são considerados dados sensíveis.

### 4.1 Armazenamento S3/R2
- Os arquivos **não** devem ser públicos.
- **Pre-signed URLs:** O frontend solicita uma URL temporária ao backend para exibir ou fazer upload de imagens. Essa URL expira em poucos minutos (ex: 15 min), garantindo que o link não possa ser compartilhado externamente de forma permanente.

## 5. Conformidade com a LGPD

### 5.1 Criptografia
- **Em Repouso (At Rest):** O banco de dados (Neon/PostgreSQL) deve utilizar criptografia de disco. Senhas sempre armazenadas com hashes fortes.
- **Em Trânsito (In Transit):** Uso obrigatório de TLS 1.2+ em todas as comunicações.

### 5.2 Direitos do Titular
- **Anonimização:** Ao excluir um usuário, os dados pessoais (nome, email) devem ser anonimizados, mantendo-se apenas os logs de auditoria por razões legais, se necessário.
- **Gestão de Consentimento:** Registro de aceite dos Termos de Uso e Política de Privacidade.

## 6. Próximos Passos Técnicos

1. Atualizar o `schema.prisma` para incluir campos de auditoria (`createdBy`, `updatedBy`).
2. Configurar o `next-auth.d.ts` para tipagem correta dos claims customizados.
3. Implementar o serviço de `StorageService` para geração de Pre-signed URLs.
