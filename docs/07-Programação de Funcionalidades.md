# Programação de Funcionalidades

Nesta seção, a implementação do sistema é descrita por meio dos requisitos funcionais e/ou não funcionais. É essencial relacionar os requisitos atendidos com os artefatos criados (código fonte) e com o responsável pelo desenvolvimento de cada artefato em cada etapa. Nesta seção também são apresentadas as instruções para acesso e verificação da implementação.

**O que DEVE ser utilizado para o desenvolvimento da aplicação:**
- Visual Studio Code (IDE de Codificação)
- TypeScript (frontend e backend)
- Next.js 14, React, Tailwind CSS e shadcn/ui (frontend)
- Node.js 22, Express 5 e Apollo Server 4 / GraphQL (backend)
- Prisma + PostgreSQL (Base de Dados) e Redis (cache)
- Docker e Docker Compose (infraestrutura)
- GitHub e GitHub Actions (documentação, controle de versão e CI)

**O que NÃO PODE ser utilizado:**
- Valores monetários em ponto flutuante (deve-se usar Decimal)
- Acesso a carteiras de outros usuários (autorização por posse é obrigatória)

A tabela a seguir relaciona os requisitos aos artefatos desenvolvidos.

|ID    | Descrição do Requisito  | Artefatos produzidos | Responsável |
|------|-----------------------------------------|----|----|
|RF-001| A aplicação deve permitir o cadastro de usuário (nome, e-mail, senha) | `domain/User`, `application/RegisterUser`, rota REST de cadastro, serviço de bcrypt | Juliana Gimenes |
|RF-002| A aplicação deve permitir a autenticação do usuário (login/logout) com JWT | `application/AuthenticateUser`, serviço JWT, middleware de autenticação, tela de login | Juliana Gimenes |
|RF-003| A aplicação deve permitir criar uma carteira de investimentos | `domain/Portfolio`, `application/CreatePortfolio`, `PrismaPortfolioRepository`, resolver/rota | Juliana Gimenes |
|RF-004| A aplicação deve permitir listar as carteiras do usuário (paginado) | `application/ListPortfolios`, repositório com paginação, tela de carteiras | Juliana Gimenes |
|RF-005| A aplicação deve permitir visualizar o detalhe da carteira (ativos, cotações, lucro/prejuízo, valor total) | `application/GetPortfolioDetails`, `CachedPriceProvider`, tela de detalhe | Juliana Gimenes |
|RF-006| A aplicação deve permitir adicionar um ativo à carteira, com validação | `domain/Asset` (`create()`), `application/AddAssetToPortfolio`, validação Zod, modal de adicionar ativo | Juliana Gimenes |
|RF-007| A aplicação deve permitir renomear uma carteira (PATCH) | `application/RenamePortfolio`, rota PATCH, modal de renomear | Juliana Gimenes |
|RF-008| A aplicação deve permitir excluir uma carteira (DELETE), com remoção em cascata | `application/DeletePortfolio`, rota DELETE, modal de confirmação | Juliana Gimenes |
|RF-009| A aplicação deve permitir buscar e filtrar ativos dentro da carteira | filtros no `PrismaPortfolioRepository`, componente de busca/filtro | Juliana Gimenes |
|RF-010| A aplicação deve permitir visualizar a alocação por classe de ativo e o patrimônio consolidado | cálculo de alocação, dashboard com Recharts | Juliana Gimenes |
|RF-011| A aplicação deve integrar cotações reais de mercado via Brapi, com cache | `BrapiPriceProvider`, `CachedPriceProvider` (Redis), interface `PriceProvider` | Juliana Gimenes |
|RF-012| A aplicação deve aplicar autorização por posse | verificação de posse no caso de uso e no repositório (defesa em profundidade) | Juliana Gimenes |


# Instruções de acesso

A aplicação roda atualmente em **ambiente local**. Após subir os serviços de apoio com Docker Compose (PostgreSQL + Redis) e iniciar o backend e o frontend, o acesso é feito em:

- Frontend (web): `http://localhost:3000`
- API (backend): `http://localhost:4000`

> *O link da aplicação hospedada em nuvem (com HTTPS) será preenchido nesta seção assim que o deploy de produção for realizado.*

Não há usuário de teste pré-cadastrado: basta criar uma conta na própria tela de cadastro (RF-001) e autenticar-se (RF-002) para utilizar a aplicação.

> **Links Úteis**:
>
> - [Trabalhando com HTML5 Local Storage e JSON](https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045)
> - [JSON Tutorial](https://www.w3resource.com/JSON)
> - [JSON Data Set Sample](https://opensource.adobe.com/Spry/samples/data_region/JSONDataSetSample.html)
> - [JSON - Introduction (W3Schools)](https://www.w3schools.com/js/js_json_intro.asp)
> - [JSON Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/json/index.htm)
