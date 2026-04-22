# Planejamento: Reformulação da Landing Page "Unoqual"

Este documento detalha o design, a cópia e a engenharia de dados para a nova landing page do Unoqual, focada em automação de auditorias e dimensionamento de enfermagem.

## 🎨 1. Estrutura Visual e Copy

### 🚀 1.1. Hero Section (A Primeira Impressão)
- **Visual:** Mockup 3D do Unoqual em um tablet (iPad Pro) nas mãos de um enfermeiro(a) uniformizado. Fundo limpo (off-white) com animação sutil de entrada (fade-in + up).
- **Copy (Gatilho da Especificidade):** 
  - **H1:** "Automatize as Auditorias de Enfermagem da sua Unidade. De 35 horas para relatórios instantâneos."
  - **Sub-copy:** "Garanta 100% de conformidade com as resoluções do Cofen e Anvisa. A plataforma definitiva para o Nursing Director gerenciar o Staffing e as inspeções sem retrabalho."
- **CTA Principal:** "Testar na Minha Unidade" (Botão azul vibrante com efeito de brilho).

### 📉 1.2. Seção da Dor (Gatilho da Empatia e Prova Social)
- **Visual:** Transição de fundo para cores escuras (Slate-900). Cards em cascata que surgem com o scroll.
- **Copy:** "Você sabe quanto custa o tempo do seu Technical Lead (Responsável Técnico - RT)?"
- **Pain Points (Bulleted):**
  - Dias perdidos cruzando planilhas de staffing com o Cofen.
  - Risco jurídico com formulários de papel perdidos ou ilegíveis.
  - Falta de visibilidade em tempo real dos problemas estruturais da Facility (Unidade de Saúde).

### 🛠️ 1.3. A Solução: OKRs na Prática (Rigor Técnico)
- **Visual:** Split screen. Lado Esquerdo: Mariana (Consultora/RT) preenchendo o app. Lado Direito: Preview do PDF sendo gerado em tempo real com barra de progresso.
- **Copy:** "A engenharia por trás da conformidade."
- **Feature 1 - Instant Reporting:** "O RT finaliza a inspeção no Ward (Setor de Internação) e o laudo em PDF já está no seu e-mail, padronizado."
- **Feature 2 - Compliance Nativo:** "Algoritmos de Staffing (Dimensionamento de Pessoal) atualizados com a legislação vigente."

### ⚙️ 1.4. Como Funciona (O Fluxo Digitalizado)
- **Visual:** Diagrama de 3 passos com linha do tempo animada e ícones de alta fidelidade.
- **Passo 1: Mapeamento:** "Cadastre os dados base da sua Facility (Unidade)."
- **Passo 2: Inspeção Guiada:** "O RT usa checklists inteligentes e captura fotos criptografadas direto do celular."
- **Passo 3: Relatório Instantâneo:** "Geração de laudos com trilha de auditoria e assinatura digital."

### 🏛️ 1.5. Social Proof / Autoridade
- **Visual:** Logotipos das legislações (Cofen, Anvisa RDC 50/63) em tons de cinza com opacidade de 60%, rodando em um carrossel infinito (infinite slider).
- **Copy:** "Motor de regras parametrizado com as mais exigentes normas sanitárias e conselhos de classe do Brasil."

### 🚨 1.6. CTA Final (Gatilho da Urgência / Aversão à Perda)
- **Visual:** Fundo azul profundo (Blue-900), tipografia H2 branca com peso pesado.
- **Copy:** "Sua próxima fiscalização pode acontecer amanhã. O seu RT está preparado?"
- **Botão:** "Blindar minha Unidade Agora".

---

## 💾 2. Engenharia de Dados (Lead/Signup)

O fluxo de captura de leads será convertido em um processo de Onboarding automático:

1. **Persistência Imediata:** Ao clicar no CTA e preencher o formulário inicial:
   - Backend cria o registro na tabela `organizations` (nome do Hospital/Holding).
   - Backend cria o usuário na tabela `users` com `role: GESTOR` (ou Manager conforme o schema).
   - O usuário é atrelado à organização criada.
2. **First Login Experience:**
   - O sistema redireciona o usuário para o `/dashboard`.
   - O dashboard já apresenta um fluxo de configuração (Wizard) para cadastrar a primeira `facility` e convidar os `technical_lead` (RTs).
3. **Multi-tenancy Nativo:** O isolamento de dados é garantido desde o milissegundo zero pela lógica de `organizationId` implementada na etapa de segurança.

---

## 📅 3. Cronograma de Implementação

1. **Fase 1 (UI/UX):** Criação dos componentes estruturais (Hero, Cards de Dor, Solução).
2. **Fase 2 (Animações):** Implementação do Scroll Reveal e Carrossel Infinito de logos.
3. **Fase 3 (Engenharia):** Implementação do formulário de Onboarding e lógica de criação automática de Organização/Usuário.
4. **Fase 4 (Validação):** Testes de responsividade e fluxo de primeiro login.
