# Proposta de Evolução de Banco de Dados

Este documento descreve as diretrizes para a evolução do schema do banco de dados, visando escalabilidade, padronização e conformidade regulatória.

---

## 🎯 Contexto e Motivação

Definir estrutura inicial para atingir os objetivos de escalabilidade e automação instantânea, o esquema precisa ser refatorado para suportar:

- **Normalização de Setores:** Erradicação de dados desnormalizados (strings livres) que impedem relatórios comparativos eficazes.
- **Filtro por Perfil:** Adaptação da interface e dos checklists conforme o tipo de unidade (ex: UPA, Hospital Geral, UBS).
- **Multidisciplinaridade:** Preparação do motor de cálculo para outras categorias profissionais (Medicina, Fisioterapia, Nutrição).
- **Validade Jurídica:** Implementação de trilha de auditoria (*audit trail*) e assinaturas digitais para os laudos gerados.
- **Conformidade Normativa:** Padronização governamental (RDC 50/Anvisa) e nomenclaturas internacionais de *Health IT*.

Bem como as demais regras que forem surgindo.

---

## 🛠️ Padrões Técnicos

Para garantir a consistência e manutenibilidade do banco de dados, seguimos os seguintes padrões:

- **Naming Convention:** Uso rigoroso de `snake_case` para nomes de tabelas e colunas.
- **Language:** Identificadores e nomes técnicos devem estar sempre em **US English**.
- **Types:** Utilização de `UUID` (v4 ou v7) para todas as chaves primárias.

> [!TIP]
> O uso de UUIDs facilita a sincronização de dados e aumenta a segurança ao evitar IDs sequenciais previsíveis.

---

## 🏗️ Entidades e Relacionamentos

### A. Infraestrutura Padronizada (Seed Data)
Criação de tabelas de domínio para que o usuário não precise digitar nomes de setores manualmente, garantindo a integridade dos dados para relatórios de BI.

### B. Diretrizes de Refatoração
A refatoração foca em decompor tabelas monolíticas em entidades menores e mais especializadas, seguindo os princípios de Normalização de Banco de Dados e as diretrizes da LGPD para minimização de dados sensíveis.

---

## 🏗️ Seeds

### A. Infraestrutura Padronizada (Seed Data)
Em ambiente local e stage iremos trabalhar com seeds de dados fakes para simular a infraestrutura hospitalar.
Também teremos seeds para dados de domínio (normas, setores, etc) que serão carregados na inicialização do banco de dados, inclusive para produção.
Esses diferentes tipos de seeds devem ser isolados em scrips distintos.

# Proposta Inicial de Modelagem de Dados

Este documento detalha a estrutura do banco de dados (Schema Prisma) proposta para o **Unoqual**, focando na automação de consultorias de enfermagem.

---

## 🧠 Decisões de Engenharia e Regras de Negócio

### 1. Separação de Preocupações (Checklist Dinâmico)
As perguntas dos formulários não estão no banco de dados. Elas vivem em arquivos de configuração no código (JSON/Typescript). O banco armazena apenas as respostas ligadas a chaves (checklist_item_key). Isso permite evoluir as normas (RDC 50, etc.) sem precisar de migrações complexas.

### 2. Nomenclatura Global (Health IT Standard)
Utilizamos termos em inglês técnico para as entidades e campos (ex: facility em vez de hospital, ward em vez de enfermaria). Isso facilita a integração futura com ferramentas de BI e padrões globais de dados em saúde.

### 3. Trilha de Auditoria (Audit Trail)
Foram adicionados os campos report_hash, signature_ip e signature_user_agent.

Justificativa: Garantir o não-repúdio. Como os laudos técnicos da Mariana podem gerar impacto jurídico para os hospitais, precisamos provar a integridade do documento no momento da finalização.

### 4. Padronização de Setores

Dúvida: Temos itens de inspeção por setor ou um nivel acima, ou seja, por unidade de saúde, como o dimensionamento de pessoal que não sejam médicos nem enfermeiros, isso foi previsto no InspectionEntry?

Resposta: Sim, isso está previsto, e a vinculação com a Unidade de Saúde (Facility) acontece através da tabela pai Inspection.

#### 4.1. Como sabemos a qual Unidade de Saúde o item pertence?
No Prisma (e em bancos relacionais), seguimos a "corrente" de IDs.

Todo InspectionEntry (item de inspeção) é obrigatoriamente ligado a uma Inspection (ID da inspeção).

Toda Inspection é obrigatoriamente ligada a uma Facility (Unidade de Saúde).

Portanto, mesmo que o departmentId seja nulo (o que indica que o item é de nível "Unidade/Hospital" e não de um setor específico), nós sabemos a qual unidade ele pertence fazendo o caminho:
InspectionEntry -> Inspection -> Facility.

No código (Prisma), o Diego buscaria assim:

```typescript
const item = await prisma.inspectionEntry.findUnique({
  where: { id: "ID_DO_ITEM" },
  include: {
    inspection: {
      include: { facility: true } // Aqui acessamos os dados da Unidade
    }
  }
});
```

#### 4.2. O caso do Dimensionamento (Não Médicos/Enfermeiros)
Para itens que não são médicos nem enfermeiros (ex: auxiliares de higienização, administrativos, pessoal da lavanderia), o schema cobre de duas formas:

Se for uma pergunta de Checklist: Se a Mariana estiver avaliando se "A equipe de limpeza utiliza EPI?", isso será um InspectionEntry com departmentId = null (pois a equipe de limpeza costuma ser da unidade toda) e a chave checklist_item_key = 'staff_cleaning_epi'.

Se for contagem numérica (Dimensionamento): No modelo StaffingCalculation, o campo professionalClass é uma String. Isso permite que a Mariana insira "Auxiliar de Limpeza", "Recepcionista" ou "Copeiro", salvando o requiredStaffing (necessário) vs currentStaffing (encontrado) sem estar presa apenas a médicos e enfermeiros.

---

## 🛠️ Schema Prisma (PostgreSQL)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- ENUMS ---

enum FacilitySize {
  SMALL      @map("small")
  MEDIUM     @map("medium")
  LARGE      @map("large")
}

enum ComplianceStatus {
  COMPLIANT       @map("compliant")
  NON_COMPLIANT   @map("non_compliant")
  NOT_APPLICABLE  @map("not_applicable")
}

enum FindingSeverity {
  CRITICAL  @map("critical")
  IMPORTANT @map("important")
  MINOR     @map("minor")
  NONE      @map("none")
}

// --- MODELS ---

model Organization {
  id          String     @id @default(uuid()) @map("id")
  name        String     @map("name")
  cnpj        String     @unique @map("cnpj")
  facilities  Facility[]
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@map("organizations")
}

model Facility {
  id              String       @id @default(uuid()) @map("id")
  organizationId  String       @map("organization_id")
  name            String       @map("name")
  size            FacilitySize @map("size")
  bedCapacity     Int          @map("bed_capacity")
  organization    Organization @relation(fields: [organizationId], references: [id])
  departments     Department[]
  inspections     Inspection[]
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  @@map("facilities")
}

model Department {
  id                   String     @id @default(uuid()) @map("id")
  facilityId           String     @map("facility_id")
  name                 String     @map("name")
  bedCount             Int        @default(0) @map("bed_count")
  averageOccupancyRate Float?     @map("average_occupancy_rate")
  facility             Facility   @relation(fields: [facilityId], references: [id])
  inspectionEntries    InspectionEntry[]
  staffingCalculations StaffingCalculation[]
  createdAt            DateTime   @default(now()) @map("created_at")
  updatedAt            DateTime   @updatedAt @map("updated_at")

  @@map("departments")
}

model Inspection {
  id                   String                @id @default(uuid()) @map("id")
  facilityId           String                @map("facility_id")
  inspectorId          String                @map("inspector_id")
  status               String                @default("draft") @map("status")
  completedAt          DateTime?             @map("completed_at")
  reportHash           String?               @map("report_hash") 
  signatureIp          String?               @map("signature_ip")
  signatureUserAgent   String?               @map("signature_user_agent")
  facility             Facility              @relation(fields: [facilityId], references: [id])
  entries              InspectionEntry[]
  staffingCalculations StaffingCalculation[]
  createdAt            DateTime              @default(now()) @map("created_at")
  updatedAt            DateTime              @updatedAt @map("updated_at")

  @@map("inspections")
}

model InspectionEntry {
  id                String           @id @default(uuid()) @map("id")
  inspectionId      String           @map("inspection_id")
  departmentId      String?          @map("department_id")
  checklistItemKey  String           @map("checklist_item_key")
  complianceStatus  ComplianceStatus @map("compliance_status")
  findingSeverity   FindingSeverity  @default(NONE) @map("finding_severity")
  observation       String?          @map("observation")
  evidenceUrl       String?          @map("evidence_url")
  recommendedAction String?          @map("recommended_action")
  inspection        Inspection       @relation(fields: [inspectionId], references: [id])
  department        Department?      @relation(fields: [departmentId], references: [id])

  @@index([inspectionId, checklistItemKey])
  @@map("inspection_entries")
}

model StaffingCalculation {
  id                  String     @id @default(uuid()) @map("id")
  inspectionId        String     @map("inspection_id")
  departmentId        String     @map("department_id")
  professionalClass   String     @map("professional_class")
  totalNursingHours   Float      @map("total_nursing_hours")
  requiredStaffing    Int        @map("required_staffing")
  currentStaffing     Int        @map("current_staffing")
  staffingGap         Int        @map("staffing_gap")
  inspection          Inspection @relation(fields: [inspectionId], references: [id])
  department          Department @relation(fields: [departmentId], references: [id])

  @@map("staffing_calculations")
}