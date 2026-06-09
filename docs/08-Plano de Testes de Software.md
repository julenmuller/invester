# Plano de Testes de Software

Apresenta os cenários de testes utilizados na realização dos testes da aplicação. Os cenários foram escolhidos de forma a demonstrar os requisitos sendo satisfeitos.

Os casos de teste estão enumerados de forma sequencial, garantindo que o(s) requisito(s) associado(s) a cada um deles está(ão) correto(s) — de acordo com o que foi definido na seção "2 - Especificação do Projeto".

Além dos testes funcionais descritos abaixo, a aplicação conta com **testes unitários automatizados com Jest** (26 testes), cobrindo as entidades `Asset`, `Portfolio` e `User` e o caso de uso `AddAssetToPortfolio`, utilizando repositórios *fake* em memória para isolar a regra de negócio.

| **Caso de Teste** 	| **CT01 – Cadastrar usuário** 	|
|:---:	|:---:	|
|	Requisito Associado 	|RF-001 A aplicação deve permitir o cadastro de usuário (nome, e-mail, senha). <br> RNF-002 As entradas devem ser validadas com Zod. <br> RNF-003 A senha deve ser armazenada com bcrypt. |
| Objetivo do Teste 	| Verificar se o usuário consegue se cadastrar na aplicação. |
| Passos 	| - Acessar o navegador <br> - Informar o endereço da aplicação (http://localhost:3000) <br> - Clicar em "Criar conta" <br> - Preencher os campos obrigatórios (nome, e-mail, senha) <br> - Clicar em "Cadastrar" |
|Dados de entrada| Beatriz Costa, beatriz@email.com, Senha@123
|Critério de Êxito | - O cadastro foi realizado com sucesso e o usuário é direcionado/autenticado. |
|  	|  	|
| Caso de Teste 	| **CT02 – Efetuar login** 	|
|Requisito Associado | RF-002 A aplicação deve permitir a autenticação do usuário (login/logout) com JWT. |
| Objetivo do Teste 	| Verificar se o usuário consegue realizar login. |
| Passos 	| - Acessar o navegador <br> - Informar o endereço da aplicação (http://localhost:3000) <br> - Preencher o campo e-mail <br> - Preencher o campo senha <br> - Clicar em "Entrar" |
|Dados de entrada| beatriz@email.com, Senha@123
|Critério de Êxito | - O login foi realizado com sucesso e um token JWT é emitido. |
|  	|  	|
| **Caso de Teste** 	| **CT03 – Criar carteira**	|
||
|	Requisito Associado 	| RF-003 A aplicação deve permitir criar uma carteira de investimentos. <br> RF-012 A carteira deve ser associada ao usuário autenticado (autorização por posse). |
| Objetivo do Teste 	| Verificar se o usuário consegue criar uma carteira. |
| Passos 	| - Estar autenticado <br> - Acessar a área de carteiras <br> - Clicar em "Nova carteira" <br> - Informar o nome da carteira <br> - Clicar em "Criar"|
|Dados de entrada| Carteira Longo Prazo
|Critério de Êxito | - A carteira é criada e passa a aparecer na lista do usuário. |
|  	|  	|
| **Caso de Teste** 	| **CT04 – Adicionar ativo** 	|
||
|	Requisito Associado 	|RF-006 A aplicação deve permitir adicionar um ativo à carteira (ticker, tipo, quantidade, preço médio), com validação (quantidade > 0, preço > 0, ticker em formato correto). <br> RNF-002 Validação de dados com Zod. |
| Objetivo do Teste 	| Verificar se o usuário consegue adicionar um ativo válido à carteira. |
| Passos 	| - Estar autenticado <br> - Abrir o detalhe de uma carteira <br> - Clicar em "Adicionar ativo" <br> - Preencher os campos (ticker, tipo, quantidade, preço médio) <br> - Clicar em "Salvar"|
|Dados de entrada| PETR4, Ação, 100, 32.50
|Critério de Êxito | - O ativo é adicionado à carteira e a validação rejeita dados inválidos (ex.: quantidade 0). |
|  	|  	|
| **Caso de Teste** 	| **CT05 – Visualizar cotações e desempenho** 	|
||
|	Requisito Associado 	| RF-005 A aplicação deve permitir visualizar o detalhe da carteira (ativos, cotações atuais, lucro/prejuízo e valor total). <br> RF-011 Integração com cotações reais de mercado via Brapi, com cache. |
| Objetivo do Teste 	| Verificar se as cotações reais e o desempenho são exibidos corretamente. |
| Passos 	| - Estar autenticado <br> - Abrir o detalhe de uma carteira com ativos <br> - Observar a cotação atual, o lucro/prejuízo e o valor total de cada ativo|
|Dados de entrada| Carteira Longo Prazo (com PETR4)
|Critério de Êxito | - As cotações reais são exibidas e o lucro/prejuízo e o valor total são calculados corretamente. |
|  	|  	|
| **Caso de Teste** 	| **CT06 – Buscar e filtrar ativos** 	|
||
|	Requisito Associado 	| RF-009 A aplicação deve permitir buscar e filtrar ativos dentro da carteira (por código e por tipo). <br> RF-004 A listagem deve ser paginada. |
| Objetivo do Teste 	| Verificar se é possível localizar um ativo específico na carteira. |
| Passos 	| - Estar autenticado <br> - Abrir o detalhe de uma carteira <br> - Digitar o código do ativo no campo de busca ou selecionar o tipo no filtro <br> - Observar a lista filtrada|
|Dados de entrada| PETR4 / tipo: Ação
|Critério de Êxito | - Apenas os ativos correspondentes ao termo/tipo são exibidos. |
|  	|  	|
| **Caso de Teste** 	| **CT07 – Renomear carteira** 	|
||
|	Requisito Associado 	|RF-007 A aplicação deve permitir renomear uma carteira (PATCH). <br> RF-012 Autorização por posse. |
| Objetivo do Teste 	| Verificar se o usuário consegue renomear sua carteira. |
| Passos 	| - Estar autenticado <br> - Abrir uma carteira <br> - Clicar em "Renomear" <br> - Informar o novo nome <br> - Clicar em "Salvar"|
|Dados de entrada| Carteira Dividendos
|Critério de Êxito | - O nome da carteira é atualizado com sucesso. |
 |  	|  	|
 | **Caso de Teste** 	|**CT08 – Excluir carteira**|
 |	Requisito Associado 	|RF-008 A aplicação deve permitir excluir uma carteira (DELETE), com confirmação e remoção em cascata dos ativos. <br> RF-012 Autorização por posse.|
 | Objetivo do Teste 	| Excluir uma carteira e seus ativos.|
 | Passos | - Estar autenticado <br> - Abrir uma carteira <br> - Clicar em "Excluir" <br> - Confirmar a exclusão|
 |Dados de entrada| Carteira Dividendos
 |Critério de Êxito | - A carteira e seus ativos são removidos e a carteira deixa de aparecer na lista.|
  |  	|  	|
