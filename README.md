# InvestHub

API de gestão de carteira de investimentos para Assessores de Investimentos (AAIs).

## Stack

- Node.js 20 + TypeScript (strict)
- Express 5 + Apollo Server 4 (GraphQL)
- Prisma + PostgreSQL
- Redis (ioredis) para cache de cotações
- JWT + bcrypt
- Brapi como provedor de cotações
- Jest + ts-jest
- Logs estruturados com Pino

## Arquitetura

Clean Architecture em 4 camadas — a dependência sempre aponta para dentro:

```
apps/api/src/
├── domain/          # entidades, contratos (interfaces), erros
├── application/     # casos de uso
├── infrastructure/  # Prisma, Brapi, Redis, bcrypt, JWT
└── http/            # Express, GraphQL, middleware
```

`buildServer()` é separado do `listen()` para permitir testes de integração.

## Escalabilidade

O serviço é **stateless**: nenhuma requisição guarda estado em memória do
processo entre requisições. Isso é o que permite escalar nas duas direções.

- **Horizontal (mais instâncias):** como qualquer instância atende qualquer
  requisição, basta colocar várias atrás de um load balancer.
  - **Autenticação por JWT** — sem sessão em servidor (`JwtTokenService`).
  - **Cache de cotações no Redis**, nunca na memória do processo
    (`CachedPriceProvider`) — todas as instâncias compartilham o mesmo cache.
  - **Pool do Prisma limitado por instância** (`DATABASE_CONNECTION_LIMIT`) para
    que N instâncias não estourem o `max_connections` do Postgres.
  - **`/ready`** verifica Postgres + Redis; o orquestrador só roteia tráfego
    para instâncias prontas. No deploy, o **graceful shutdown** (SIGTERM) faz
    `/ready` responder 503, drena as requisições em andamento e fecha
    DB/Redis — deploy/scale sem downtime.
  - **Paginação** (`limit`/`offset`) nos endpoints de lista evita carregar tudo
    sob carga.
  - **Concorrência:** nada depende da ordem de execução entre requisições; o
    único estado compartilhado é o Redis (documentado em `CachedPriceProvider`).
- **Vertical (instâncias maiores):** mais CPU/memória aumenta a vazão de cada
  instância; é majoritariamente configuração de deploy. Suba o
  `DATABASE_CONNECTION_LIMIT` (e o `max_connections` do Postgres) junto com os
  recursos para aproveitar a máquina maior.

## Como rodar

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker (para Postgres + Redis)

### 1. Subir Postgres e Redis

```bash
docker compose up -d postgres redis
```

### 2. Instalar dependências e configurar a API

```bash
cd apps/api
cp .env.example .env
# edite .env e defina BRAPI_TOKEN (https://brapi.dev) e um JWT_SECRET forte
pnpm install
pnpm prisma:migrate
pnpm dev
```

A API sobe em `http://localhost:3001`.

### 3. Subir tudo via Docker

```bash
JWT_SECRET=$(openssl rand -hex 32) BRAPI_TOKEN=seu_token docker compose up --build
```

## Endpoints REST

| Método | Rota                          | Auth | Descrição                                       |
|--------|-------------------------------|------|-------------------------------------------------|
| GET    | `/health`                     | —    | Liveness — o processo está vivo                 |
| GET    | `/ready`                      | —    | Readiness — checa Postgres + Redis (503 se não) |
| POST   | `/auth/register`              | —    | Cria usuário                                    |
| POST   | `/auth/login`                 | —    | Retorna `{ token }` JWT                         |
| GET    | `/portfolios`                 | JWT  | Lista carteiras (`?limit=&offset=`, paginado)   |
| POST   | `/portfolios`                 | JWT  | Cria carteira                                   |
| GET    | `/portfolios/:id`             | JWT  | Carteira + cotações atuais + L/P                |
| POST   | `/portfolios/:id/assets`      | JWT  | Adiciona ativo                                  |

Header de autenticação: `Authorization: Bearer <token>`.

## GraphQL

Disponível em `POST /graphql` (mesmos use cases do REST).

```graphql
query { portfolios { id name totalCost } }
query { portfolio(id: "uuid") { name totalValue assets { ticker currentPrice } } }
mutation {
  addAsset(
    portfolioId: "uuid",
    input: { ticker: "PETR4", type: STOCK, quantity: 10, avgPrice: 30.5 }
  ) { id ticker }
}
```

## Testes

```bash
cd apps/api
pnpm test
```

Thresholds de cobertura: linhas 80%, funções 70%. Testes unitários cobrem entidades (`Asset`, `Portfolio`, `User`) e use case (`AddAssetToPortfolio`) usando repositórios fake em memória — sem banco nem rede.

## Scripts úteis

| Script              | O que faz                                |
|---------------------|------------------------------------------|
| `pnpm dev`          | Roda em watch com tsx                    |
| `pnpm build`        | Compila TypeScript para `dist/`          |
| `pnpm start`        | Roda o build (`node dist`)               |
| `pnpm test`         | Roda Jest                                |
| `pnpm prisma:migrate` | Aplica migrations de desenvolvimento   |

## Variáveis de ambiente

Todas validadas com Zod no boot (falha rápido se faltar algo):

- `DATABASE_URL` — string de conexão do Postgres
- `DATABASE_CONNECTION_LIMIT` — máx. de conexões do pool do Prisma **por instância** (default `10`)
- `REDIS_URL` — string de conexão do Redis
- `JWT_SECRET` — segredo do JWT (mín. 16 chars)
- `BRAPI_TOKEN` — token da Brapi
- `WEB_URL` — origem permitida pelo CORS (default `http://localhost:3000`)
- `PORT` — porta HTTP (default `3001`)