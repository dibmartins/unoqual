# 🎨 Plano de UI/UX

A interface do usuário deve ser construída usando componentes modernos de UI compatíveis com as mais recentes tendências de design e usabilidade. Respeitar padrões de comunicação visual e de experiência do usuário (UX) estabelecidos pelo mercado de software moderno.

---

## 🛠️ Informações Gerais

*   **Projeto:** Unoqual SaaS
*   **Engenheiro Responsável:** Especialista Unoqual
*   **Stack Visual:** Next.js + Tailwind CSS + shadcn/ui + Tremor

---

## 1. Visão Estratégica

O design do Unoqual deve equilibrar a facilidade de preenchimento em campo (Mariana no hospital com tablet/celular) com a densidade de análise (Mariana no escritório gerando laudos).

### Pilares de Design:
*   **Acessibilidade Tátil:** Botões de inspeção (Adequado/Inadequado) com área de clique expandida.
*   **Foco Cognitivo:** Uso de *Progressive Disclosure* para não sobrecarregar a tela com centenas de itens da RDC 50 de uma vez.
*   **Semântica de Saúde:** Cores baseadas em gravidade de risco (Sistema de Cores de Semáforo).

---

## 2. A Dupla Dinâmica: Por que shadcn/ui + Tremor?

### **shadcn/ui (A Fundação)**
Utilizado para a estrutura do sistema e interação do usuário.
*   **Uso no Unoqual:** Formulários de login, modais de cadastro de unidades, accordions para os grupos de inspeção, e drawers mobile para preenchimento de evidências fotográficas.
*   **Vantagem:** Podemos customizar o componente de Checkbox ou RadioGroup para se comportar exatamente como um roteiro de inspeção técnica exige.

### **Tremor (A Inteligência)**
Utilizado para os Dashboards de auditoria e laudos.
*   **Uso no Unoqual:** Gráficos de barra para o Staffing Gap (Dimensionamento), KPIs de conformidade por setor e mapas de calor de risco.
*   **Vantagem:** Componentes como `DonutChart` e `BarList` são otimizados para dashboards de negócios e possuem uma estética limpa que transmite profissionalismo no laudo final.

---

## 3. Arquitetura de Interface (UX)

### A. Dashboard Principal (Unidade de Saúde)
*   **KPI Cards (Tremor):** Total de não conformidades, % de adequação geral, e status do dimensionamento.
*   **Risk Matrix (Tremor):** Um gráfico de barras comparando a severidade dos achados por setor.

### B. Fluxo de Inspeção (Mobile-First)
*   **Steppers/Accordions:** Divisão por categorias (Estrutura, Processos, Pessoal).
*   **Status Indicators:** Cores padronizadas:
    *   **Compliant:** Verde suave.
    *   **Non-Compliant:** Vermelho/Laranja (dependendo da severidade).
    *   **N/A:** Cinza neutro.

### C. Gerador de Laudos
*   **Preview em tempo real:** Utilizar o componente `Card` do Tremor para mostrar como o achado crítico ficará no relatório final.

---

## 4. Instruções de Setup

Para integrar essa stack no projeto Next.js existente, siga estes passos:

### Passo 1: Inicializar shadcn/ui
No terminal, na raiz do projeto:
```bash
npx shadcn-ui@latest init
```
*Configuração recomendada: Estilo: New York, Cor base: Slate, CSS Variables: Yes.*

### Passo 2: Instalar Componentes Essenciais do shadcn
O Unoqual precisará inicialmente de:
```bash
npx shadcn-ui@latest add accordion button card checkbox dialog input label radio-group select table
```

### Passo 3: Instalar Tremor
O Tremor utiliza Tailwind, então a integração é fluida:
```bash
npm install @tremor/react
```
> [!NOTE]
> Atualizar o arquivo `tailwind.config.ts` conforme a documentação do Tremor para garantir que as cores dos gráficos sejam carregadas corretamente.

### Passo 4: Instalar Ícones (Lucide React)
O shadcn usa Lucide por padrão, excelente para saúde:
```bash
npm install lucide-react
```

---

## 5. Diretrizes de Cores e Tipografia

| Elemento | Token / Cor | Finalidade |
| :--- | :--- | :--- |
| **Brand Primary** | `Slate-900` | Cabeçalhos e seriedade técnica. |
| **Success** | `Emerald-600` | Itens em conformidade (Cofen/Anvisa). |
| **Warning** | `Amber-500` | Não conformidade moderada. |
| **Critical** | `Rose-600` | Risco direto à vida / Achado crítico. |
| **Typography** | `Inter` ou `Geist` | Leitura clara de dados numéricos e técnicos. |

---