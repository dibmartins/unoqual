# Configurações do Setor
- Nome personalizado.  (Um "apelido" do setor naquela unidade (ex: "UTI B - 3º Andar"))
- Classificaçao  (ex: vincula o setor real UTI B - 3º Andar à classificação "UTI Adulto". Ver mapa Classificação de Setores).
- Capacidade fisica instalada (número de leitos, poltronas ou salas) especificamente deste setor.
- Possui atuação da enfermagem (boolean)

Para Cada Setor COM ATUAÇÃO DA ENFERMAGEM deve-se calcular:

**Total de Horas de Enfermagem por Complexidade (THE)**
Da distribuição de profissionais informada (Enfermeiro, Técnico e Auxiliar)
- CUIDADO MÍNIMO (PCM): 4h  - 33-37% devem ser enfermeiros
- CUIDADO INTERMEDIÁRIO (PCI): 6h -  33-37% devem ser enfermeiros
- CUIDADO SEMI-INTENSIVO (PCSI): 10h  -  42-46% devem serenfermeiros
- CUIDADO INTENSIVO (PCSI) - 18h  - 52-56% devem serenfermeiros

THE= [(PCM x 4) + (PCI x 6) + (PCAD x 10) + (PCSI x 10) + (PCIt x 18)]

**Quantitativo de Pessoal pelo Método de Marinho (QP)**
QP = THE X KM (ver Item 3 das configuracoes da US)