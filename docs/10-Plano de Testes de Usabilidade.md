# Plano de Testes de Usabilidade

Os testes de usabilidade permitem avaliar a qualidade da interface com o usuário da aplicação interativa.

Um plano de teste de usabilidade deverá conter: 

## Escala de Avaliação

| Nível    | Descrição                                       |
| -------- | ----------------------------------------------- | 
| 0 | Não é encarado necessariamente como um problema de usabilidade. | 
| 1 | Problema estético que não precisa ser corrigido, a menos que haja tempo e recurso disponível. | 
| 2 | Pequeno problema com baixa prioridade de correção.  |
| 3 | Problema com alta prioridade de correção. | 
| 4 | Gargalo de usabilidade: só pode liberar se corrigido. | 

## Avaliação Heurística (Estática)
Avaliação baseada nas 10 Heurísticas de Nielsen. Três avaliadores atribuíram notas de 0 a 4, foi calculada a média e definido o consenso.

| Heurística | Notas | Média | Consenso | Considerações | Sugestões de melhoria |
| -------- | ------- | ----- |--------- |-------------- | --------------------- |
| Visibilidade do status do sistema | 1, 2, 1 | 1.33 | 1 | Atualização de cotações nem sempre indica claramente que está carregando.| Exibir indicador de carregamento ao buscar cotações e a data/hora da última atualização.|
| Compatibilidade com o mundo real | 1, 1, 1. | 1.0 | 1 | Termos do mercado financeiro podem confundir investidores iniciantes.| Usar rótulos claros (ex.: "Preço médio", "Lucro/Prejuízo") e tooltips explicativos.|
| Controle e liberdade do usuário | 2, 2, 3 | 2.33 | 2 | Usuário sente falta de botões claros de cancelar/voltar ao adicionar ativo.| Adicionar botões de cancelamento nos modais de carteira e de ativo.|
| Consistência e padrões | 2, 3, 2 | 2.33 | 2 | Alguns componentes têm estilos diferentes entre dashboard e detalhe da carteira.| Padronizar layout, botões e cores com shadcn/ui em todas as telas.|
| Prevenção de erros | 3, 2, 3 | 2.67 | 3 | Formulário de ativo pode aceitar valores fora do esperado sem aviso imediato.| Inserir validação em tempo real (ticker, quantidade > 0, preço > 0) com Zod no frontend.|
| Reconhecimento em vez de memorização | 1, 2, 1 | 1.33 | 1 | Filtros de ativos não ficam visíveis após aplicação, exigindo memorização.| Exibir os filtros aplicados no topo da lista de ativos.|
| Flexibilidade e eficiência de uso | 2, 2, 2 | 2.0 | 2 | Não há atalhos para usuários avançados que gerenciam muitas carteiras.| Incluir busca rápida de carteiras e ações por teclado.|
| Design estético e minimalista | 1, 1, 2 | 1.33 | 1 | Telas com muitos indicadores podem sobrecarregar o iniciante.| Reduzir elementos não essenciais e reforçar a hierarquia visual do dashboard.|
| Ajuda aos usuários a reconhecer, diagnosticar e corrigir erros | 2, 2, 3 | 2.33 | 2 | Mensagens de erro de validação pouco claras.| Mensagens mais detalhadas e orientativas nos formulários.|
| Ajuda e documentação | 3, 3, 3 | 3.0 | 3 | Não existe seção de ajuda ou FAQ.| Criar página de ajuda e dicas rápidas sobre conceitos de investimento dentro do app.|

## Avaliação Funcional/Dinâmica
Testes realizados com base em cenários de uso do sistema (Cadastro, Carteiras, Ativos, Dashboard, etc.).

| Atividade | Feedback do usuário | Problemas encontrados | Sugestões de melhoria |
| -------- | ------- | ----- |--------- |
| Cadastro de usuário | Usuário teve dúvidas sobre senha forte. | Sistema não especifica requisitos de senha. | Exibir requisitos mínimos de senha no formulário.| 
| Criar carteira | Processo simples e rápido. | Falta confirmação visual após criar. | Exibir mensagem de sucesso e destacar a nova carteira na lista.|
| Adicionar ativo | Usuário achou prático, mas teve dúvida sobre o campo "tipo". | Tipos de ativo pouco explicados. | Usar lista suspensa com os tipos (Ação, FII, Renda Fixa) e exemplos. |
| Detalhe da carteira | Usuário visualizou cotações e lucro/prejuízo facilmente. | Filtros não permanecem visíveis após seleção. | Fixar filtros aplicados no topo da lista de ativos. |
| Dashboard / Alocação | Gráfico de alocação foi bem recebido. | Iniciante não entendeu as classes de ativo. | Adicionar legenda e tooltips explicando cada classe. |
| Renomear carteira | Usuário conseguiu renomear sem dificuldade. | Botão de renomear pouco visível. | Colocar a ação de renomear em destaque no menu da carteira.|
| Excluir carteira | Usuário sentiu segurança com a confirmação. | Não ficou claro que os ativos seriam removidos junto. | Informar na confirmação que a exclusão remove os ativos em cascata. |