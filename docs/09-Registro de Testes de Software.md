# Registro de Testes de Software

Para cada caso de teste definido no Plano de Testes de Software, realize o registro das evidências dos testes feitos na aplicação, que comprovem que o critério de êxito foi alcançado, ou não. Para isso, utilize uma ferramenta de captura de tela que mostre cada um dos casos de teste definidos.

| **Caso de Teste** 	| **CT01 – Cadastrar usuário** 	|
|:---:	|:---:	|
|Pré-condições|Estar na tela de cadastro (register)
|Procedimento (passo à passo)| Acessar o navegador, informar o endereço da aplicação, clicar em "Criar conta", preencher os campos obrigatórios (nome, e-mail, senha) e clicar em "Cadastrar"
|Dados de entrada|Beatriz Costa, beatriz@email.com, Senha@123
|Resultados Esperado (RE)| Usuário cadastrado com sucesso
|Resultado Obitido (RO)| Usuário cadastrado e autenticado
|Avaliação (Pegou/Não pegou erro)| Não pegou erro; validação Zod rejeita e-mail em formato inválido
|Evidencia (print Screen)|
<img width="1498" height="693" alt="image" src="" />

| **Caso de Teste** 	| **CT-002 Login Usuário** 	|
|:---:	|:---:	|
|Pré-condições| Estar na tela de login
|Procedimento (passo à passo)|- Acessar o navegador, informar o endereço da aplicação, preencher o campo e-mail, preencher o campo senha e clicar em "Entrar"
|Dados de entrada| beatriz@email.com, Senha@123
|Resultados Esperado (RE)| O login foi realizado com sucesso e um token JWT é emitido.
|Resultado Obitido (RO)| Logado
|Avaliação (Pegou/Não pegou erro)| Não pegou erro
|Evidencia (print Screen)|
<img width="1500" height="693" alt="image" src="" />

 | **Caso de Teste** 	| **CT03 – Criar carteira** 	|
|:---:	|:---:	|
|Pré-condições| Estar autenticado e acessar a área de carteiras
|Procedimento (passo à passo)|- Acessar o navegador, informar o endereço da aplicação, fazer login, clicar em "Nova carteira", informar o nome e clicar em "Criar"
|Dados de entrada|Carteira Longo Prazo
|Resultados Esperado (RE)|- A carteira é criada e aparece na lista do usuário
|Resultado Obitido (RO)| Carteira criada
|Avaliação (Pegou/Não pegou erro)| Não pegou erro; carteira associada apenas ao usuário autenticado
|Evidencia (print Screen)|
<img width="1899" height="860" alt="image" src="" />



| **Caso de Teste** 	| **CT04 – Adicionar ativo** 	|
|:---:	|:---:	|
|Pré-condições| Usuário autenticado; existir ao menos uma carteira; integração de cotações (Brapi) disponível.
|Procedimento (passo à passo)| 1 - Abrir o detalhe de uma carteira; 2 - Clicar em "Adicionar ativo"; 3 - Preencher ticker, tipo, quantidade e preço médio; 4 - Salvar; 5 - Tentar salvar um ativo inválido (quantidade 0); 6 - Conferir o cálculo de lucro/prejuízo e valor total.
|Dados de entrada| PETR4, Ação, 100, 32.50
|Resultados Esperado (RE)| 1 - Detalhe da carteira exibido; 2 - Modal de adicionar ativo exibido; 3 - Campos validados (Zod); 4 - Ativo salvo e exibido na lista com cotação atual; 5 - Ativo inválido rejeitado com mensagem; 6 - Lucro/prejuízo e valor total calculados corretamente (com Decimal).
|Resultado Obitido (RO)| Tudo conforme o esperado
|Avaliação (Pegou/Não pegou erro)| Não pegou erro
|Evidencia (print Screen)| 
<img width="1885" height="884" alt="image" src="" />

| **Caso de Teste** 	| **CT06 – Buscar e filtrar ativos** 	|
|:---:	|:---:	|
|Pré-condições| Estar logado e com carteira contendo ativos
|Procedimento (passo à passo)|- Acessar o navegador, informar o endereço da aplicação, fazer login, abrir o detalhe da carteira, digitar o código do ativo no campo de busca ou selecionar o tipo no filtro
|Dados de entrada| PETR4
|Resultados Esperado (RE)|Apenas os ativos correspondentes ao termo/tipo são exibidos
|Resultado Obitido (RO)|Ativo localizado
|Avaliação (Pegou/Não pegou erro)| Não pegou erro
|Evidencia (print Screen)|
<img width="1903" height="867" alt="image" src="" />


## Relatório de testes de software

Apresente e discuta detalhadamente os resultados obtidos nos testes realizados, destacando tanto os pontos fortes quanto as fragilidades identificadas na solução. Explique como os aspectos positivos contribuem para o desempenho e a usabilidade do sistema, e como os pontos fracos impactam sua eficácia.

Descreva as principais falhas detectadas durante os testes, fornecendo exemplos concretos e evidências que sustentem essas observações. Explicite os impactos dessas falhas na experiência do usuário, na funcionalidade do sistema e nos objetivos do projeto.

Com base nessas análises, detalhe as estratégias que o grupo pretende adotar para corrigir as deficiências e aprimorar a solução nas próximas iterações. Inclua ações específicas, como ajustes no código, modificações na interface, otimizações de desempenho ou melhorias na acessibilidade e usabilidade.

Por fim, apresente e/ou proponha as melhorias a partir dos testes realizados, destacando os ganhos obtidos e como essas alterações contribuem para a evolução do projeto.

> **Links Úteis**:
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
