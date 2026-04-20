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