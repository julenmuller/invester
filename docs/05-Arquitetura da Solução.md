# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

O InvestHub adota a **Clean Architecture**, organizada em **4 camadas**, com a dependência sempre apontando para dentro (regras de negócio no centro, detalhes de infraestrutura na borda):

- **domain**: entidades (`Asset`, `Portfolio`, `User`), interfaces de repositórios e de serviços (ex.: `PriceProvider`). É a regra de negócio pura, sem dependências externas. A entidade `Asset`, por exemplo, possui construtor privado e método `create()` que valida as regras (quantidade > 0, preço > 0, ticker em formato correto); valores monetários usam `Decimal`, nunca ponto flutuante.
- **application**: casos de uso (`CreatePortfolio`, `AddAssetToPortfolio`, `RenamePortfolio`, `DeletePortfolio`, `RegisterUser`, etc.).
- **infrastructure**: implementações concretas (`PrismaPortfolioRepository`, `BrapiPriceProvider`, `CachedPriceProvider` com Redis, serviços de bcrypt e JWT).
- **http**: rotas REST, resolvers GraphQL e middlewares (autenticação, validação com Zod, tratamento de erro).

A autorização adota **defesa em profundidade**, com verificação de posse tanto no caso de uso quanto no repositório.

## Diagrama de Classes

> - [Diagrama de Classes - InvestHub](./img/Diagrama-de-Classes.png)

## Modelo ER (Projeto Conceitual)

> - [Modelo Entidade Relacionamento - InvestHub](./img/Modelo-Entidade-Relacionamento-(Projeto-Conceitual).png)

## Projeto da Base de Dados

> - [Projeto da Base de Dados - InvestHub](./DB_Project/Projeto-da-Base-de-Dados.sql)


## Tecnologias Utilizadas

A solução foi construída como um **monorepo** gerenciado com **pnpm**, dividido entre backend e frontend, com serviços de apoio orquestrados via Docker.

**Backend**
- **Node.js 22** e **TypeScript** (modo *strict*)
- **Express 5** (servidor HTTP) e **Apollo Server 4** (API GraphQL)
- **Prisma** (ORM) sobre **PostgreSQL** (banco de dados relacional)
- **Redis / ioredis** (cache de cotações)
- **JWT** + **bcrypt** (autenticação e segurança)
- **Zod** (validação de dados de entrada)
- **Pino** (logs estruturados em JSON)
- **Jest** + **ts-jest** (testes automatizados)

**Frontend**
- **Next.js 14** (App Router), **React** e **TypeScript**
- **Tailwind CSS** e **shadcn/ui** (componentes de interface)
- **TanStack Query** (estado de servidor)
- **Recharts** (gráficos)
- **react-hook-form** + **Zod** (formulários e validação)

**Fonte de cotações**
- API pública **Brapi** (dados da B3, acessados via agregador), com cache em Redis.

**Infraestrutura / DevOps**
- **Docker** e **Docker Compose** (PostgreSQL + Redis)
- **CI com GitHub Actions** (lint + testes a cada push)
- Controle de versão **Git/GitHub**
- IDE: **Visual Studio Code**

O fluxo de uma interação típica parte do **frontend (Next.js)**, que consome a **API (REST/GraphQL)** do backend. A camada **http** valida a requisição (Zod) e a autenticação (JWT), aciona o **caso de uso** correspondente na camada *application*, que opera sobre as **entidades** do *domain* e utiliza implementações da *infrastructure* — como o `PrismaPortfolioRepository` para persistência no PostgreSQL e o `CachedPriceProvider`/`BrapiPriceProvider` para obter cotações (primeiro consultando o Redis, e só então a Brapi). O resultado é então consolidado e devolvido ao frontend, que apresenta valores, desempenho e gráficos ao usuário.

## Hospedagem

O ambiente de execução foi projetado para ser **stateless** e escalável. Localmente, os serviços de apoio (**PostgreSQL** e **Redis**) são executados via **Docker Compose**, e a aplicação roda em ambiente de desenvolvimento.

Para produção, o ambiente projetado prevê o deploy em **nuvem (ex.: AWS)**, com a aplicação empacotada em **contêineres Docker** e executada atrás de um **load balancer com HTTPS**, permitindo **escala horizontal** (múltiplas instâncias) graças à arquitetura stateless (JWT sem sessão e cache externo no Redis). A integração contínua é feita via **GitHub Actions** (lint e testes a cada push). O pool de conexões do Prisma é limitado por instância, e a aplicação expõe endpoints de **health** e **readiness**, além de *graceful shutdown* e paginação nos endpoints de lista.

> *Observação: a orquestração local via Docker Compose e a esteira de CI já estão implementadas; o deploy em nuvem com load balancer e HTTPS é o ambiente projetado para produção.*