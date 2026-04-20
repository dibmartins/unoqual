# Organização Sistêmica

## Tenants (Segmentações)
- Admin > Gerência > Unidade de Saúde > Setor

## Atores
- [Atores](atores.md)

## Módulos
### 1- Inspeções
#### Pesquisa de Inspeções
- Tela responsiva de listagem de inspeções com datagrid paginado e filtros avançados
    - Filtros
        - Período
        - Unidade de Saúde
        - Setor
        - Status
    - Ações
        - Imprimir [Laudo](laudo.md) 
        - Editar
        - Arquivar
#### Nova Inspeção
##### Tela de criação de inspeção. 
Essa tela deve permitir a criação de uma nova inspeção e uma inspeção é composta por um ou vários itens de verificação (a critério do usuário) para uma ou mais Unidades de Saúde e um ou mais Setores dessas Unidades:
- Fazer upsert da inspeção a cada item de verificação adicionado
- Os itens de verificação são:    
    - Dimensionamentos de equipe 
        - A nível de Unidade de Saúde
            - Selecionar Ocupação (Listar somente ocupações dimensionadas por Unidade de Saúde)
                - Exibir botão para ¨Incluir Dimensionamento¨
                - Ao clicar em ¨Incluir Dimensionamento¨ exibir modal com o [formulário de dimensionamento padrão](dimensionamento-padrao.md)
                - Exibir lista de dimensionamentos incluídos
        - A nível de Setor
            - Selecionar Setor
            - Selecionar Ocupação (Listar somente ocupações dimensionadas por Setor)
                - Exibir botão para ¨Incluir Dimensionamento¨
                - Se for uma ocupação de equipe médica
                    - Ao clicar em ¨Incluir Dimensionamento¨ exibir modal com o [formulário de dimensionamento específico de medicina](dimensionamento-especifico-medicina.md)
                - Se for uma ocupação de equipe de enfermagem
                    - Ao clicar em ¨Incluir Dimensionamento¨ exibir modal com o [formulário de dimensionamento padrão](dimensionamento-padrao.md)
            - Exibir lista de dimensionamentos incluídos
    - Inspeções
        - A nível de Setor
            - Selecionar Setor
                - Infraestrutura Física (ao selecionar esse item deve abrir uma modal com o [formulário de infraestrutura física](infraestrutura-fisica.md))
                - Processos (ao selecionar esse item deve abrir uma modal com o [formulário de processos](processos.md))
                - Equipamentos (ao selecionar esse item deve abrir uma modal com o [formulário de equipamentos](equipamentos.md))
                - Documentação (ao selecionar esse item deve abrir uma modal com o [formulário de documentação](documentacao.md))
            - Exibir lista de inspeções incluídas

- Botão Salvar