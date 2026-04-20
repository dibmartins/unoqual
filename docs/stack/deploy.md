# Estratégia de Deployment e Infraestrutura

Este documento detalha o fluxo de deployment e a configuração da infraestrutura para o SaaS, garantindo ambientes estáveis, escaláveis e com integração contínua (CI/CD).

---

## ☁️ Provedores de Infraestrutura

Nossa arquitetura é baseada em soluções *serverless* e *edge-ready*:

- **Frontend & Serverless Functions:** [Vercel](https://vercel.com)
  - Hospedagem do Next.js, Otimização de Imagens e Rotas de API.
- **Banco de Dados Relacional:** [Neon](https://neon.tech)
  - PostgreSQL Serverless com suporte a *autoscaling* e *branching*.
- **ORM:** [Prisma](https://prisma.io)
  - Gestão de schema e migrações tipadas.

---

## 🏗️ Configuração do Ambiente

### 1. Banco de Dados (Neon)
Para produtividade e performance, utilizamos o recurso de **Connection Pooling** do Neon.

- **DATABASE_URL:** URL com pooling (geralmente porta 5432 ou 6543) para as funções serverless.
- **DIRECT_URL:** URL direta para o banco de dados (usada pelo Prisma para rodar migrações).

### 2. Variáveis de Ambiente (Vercel)
As seguintes variáveis devem estar configuradas no painel da Vercel:

| Variável | Descrição |
| :--- | :--- |
| `DATABASE_URL` | String de conexão com pooling do Neon. |
| `DIRECT_URL` | String de conexão direta (bypass pooling) para migrações. |
| `NEXTAUTH_SECRET` | Chave de criptografia para sessões. |
| `NEXTAUTH_URL` | URL base da aplicação (ex: `https://app.unoqual.com`). |

---

## 🚀 Fluxo de Deployment

O deployment é automatizado via integração com o GitHub:

### Branch Management
- **`main`:** Ambiente de **Produção**. Qualquer *merge* nesta branch dispara o deploy para o domínio oficial.
- **Feature Branches:** Disparam **Preview Deployments**. Cada Pull Request gera uma URL única para testes e revisão.

### Pipeline de Build
Durante o comando `npm run build` na Vercel, o seguinte fluxo ocorre:
1. **Linting:** Verificação de erros de código e padrões.
2. **Type Checking:** Validação rigorosa de tipos TypeScript.
3. **Database Migration:** O sistema executa automaticamente:
   ```bash
   npx prisma migrate deploy
   ```
   > [!IMPORTANT]
   > Falhas na migração interrompem o build, impedindo que um código incompatível com o banco chegue ao ar.

---

## 🛠️ Manutenção e Monitoramento

### Logs
- Utilize o **Vercel Runtime Logs** para depurar erros em produção.
- Erros de banco de dados podem ser verificados no painel de **Operations** do Neon.

### Database Branching
Para alterações críticas no schema:
1. Crie uma branch no Neon a partir da `main`.
2. Teste as novas migrações localmente apontando para esta branch.
3. Após validado, aplique as mudanças no workflow oficial.

---

## 🔒 Segurança de Deployment

- **Vercel Firewall:** Proteção contra ataques DDoS e rate limiting nativo.
- **Trusted Sources:** O banco de dados Neon deve ser configurado para aceitar conexões apenas dos ranges de IP da Vercel (quando aplicável) ou utilizar autenticação robusta via SSL.
- **Secrets:** Nunca faça commit de arquivos `.env` ou chaves privadas. Use sempre o painel da Vercel.
