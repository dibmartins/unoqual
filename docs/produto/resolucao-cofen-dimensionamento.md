# Dimensionamento de Pessoal de Enfermagem (Resolução COFEN 543/2017)

Este documento detalha os parâmetros técnicos para o cálculo do quantitativo de profissionais de enfermagem, integrando os requisitos legais com a lógica do sistema Unoqual.

## 1. Classificação de Pacientes (SCP)
Para o dimensionamento, considera-se a carga horária média de assistência por paciente nas 24 horas:
- **Cuidado Mínimo (PCM):** 4 horas.
- **Cuidado Intermediário (PCI):** 6 horas.
- **Cuidado de Alta Dependência (PCAD):** 10 horas.
- **Cuidado Semi-Intensivo (PCSI):** 10 horas.
- **Cuidado Intensivo (PCIt):** 18 horas.

## 2. Total de Horas de Enfermagem (THE)
A fórmula para o cálculo do Total de Horas de Enfermagem (THE) é a soma do produto da quantidade de pacientes por categoria de cuidado e suas respectivas horas:

`THE = [(PCM × 4) + (PCI × 6) + (PCAD × 10) + (PCSI × 10) + (PCIt × 18)]`

## 3. Quantitativo de Pessoal (QP)
O Quantitativo de Pessoal (QP) é calculado conforme o Método de Marinho, utilizando o Total de Horas (THE) e a Constante de Marinho (KM):

`QP = THE × KM`

### Constante de Marinho (KM)
O KM é ajustado de acordo com a jornada de trabalho semanal e o Índice de Segurança Técnica (IST) de no mínimo 15%:
- **20 horas/semana:** KM = 0,4235
- **30 horas/semana:** KM = 0,2823
- **36 horas/semana:** KM = 0,2353
- **40 horas/semana:** KM = 0,2118

## 4. Distribuição da Equipe (Proporcionalidade)
A distribuição percentual mínima de profissionais deve seguir a categoria de cuidado:
- **Cuidado Mínimo e Intermediário:** 33% de Enfermeiros e demais Técnicos/Auxiliares.
- **Cuidado Semi-Intensivo:** 42% de Enfermeiros.
- **Cuidado Intensivo:** 52% de Enfermeiros.

## 5. Implementação no Unoqual
O sistema deve permitir:
1.  Entrada do Censo de Pacientes por categoria.
2.  Definição da Jornada de Trabalho do setor.
3.  Cálculo automático do QP.
4.  Identificação do "Staffing Gap" (Diferença entre o atual e o necessário).
