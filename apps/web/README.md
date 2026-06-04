# InvestHub — Web (`@invester/web`)

Frontend do InvestHub, um sistema de gestão de carteira de investimentos para
Assessores de Investimentos (AAIs). Consome a API REST de [`apps/api`](../api).

## Stack

- **Next.js 14** (App Router) + **TypeScript** (`strict`)
- **Tailwind CSS** + **shadcn/ui** (Radix)
- **TanStack Query v5** para estado de servidor
- **axios** com instância central e interceptors
- **react-hook-form** + **zod** para formulários
- **Recharts** para gráficos
- **lucide-react** para ícones

## Como rodar

Pré-requisitos: Node 20+, pnpm 9+ e a **API rodando** em `http://localhost:3001`
(veja [`apps/api`](../api)).

```bash
# a partir da raiz do monorepo
pnpm install

# variáveis de ambiente (já existe um .env.local por padrão)
cp apps/web/.env.example apps/web/.env.local

# subir o frontend
pnpm --filter @invester/web dev
```

Acesse **http://localhost:3000**.

> A partir da raiz, `pnpm dev` sobe `api` e `web` em paralelo.

## Variáveis de ambiente

| Chave                 | Descrição                  | Default                 |
| --------------------- | -------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API REST       | `http://localhost:3001` |

## Scripts

| Script        | O que faz                          |
| ------------- | ---------------------------------- |
| `pnpm dev`    | Servidor de desenvolvimento (3000) |
| `pnpm build`  | Build de produção                  |
| `pnpm start`  | Sobe o build (3000)                |
| `pnpm lint`   | ESLint (next/core-web-vitals)      |

## Telas

| Rota              | Descrição                                                        |
| ----------------- | --------------------------------------------------------------- |
| `/register`       | Cadastro (email, nome, senha) → `POST /auth/register`           |
| `/login`          | Login → `POST /auth/login`, guarda o token e vai ao dashboard   |
| `/dashboard`      | Cards de resumo + lista de carteiras + dialog "Nova carteira"   |
| `/dashboard/[id]` | Ativos (L/P em verde/vermelho), pizza de alocação, add ativo    |

## Arquitetura

```
src/
├── app/                 # rotas (App Router) + layout/providers
├── components/          # componentes compartilhados
│   └── ui/              # primitivos shadcn/ui
├── features/
│   ├── auth/            # schemas, hooks (useLogin/useRegister), forms
│   └── portfolio/       # schemas, hooks (usePortfolios/usePortfolio/…), UI
├── lib/                 # api (axios), auth (token), format (BRL), types
├── providers/           # QueryClientProvider
├── styles/tokens.ts     # design tokens (fonte única de cores)
└── middleware.ts        # guarda de rotas no edge (cookie do token)
```

### Decisões de Clean Code

- **Data fetching só via hooks** (`usePortfolios`, `usePortfolio`,
  `useCreatePortfolio`, `useAddAsset`, `useLogin`, `useRegister`). Componentes
  nunca chamam axios direto.
- **Uma instância axios** (`lib/api.ts`) injeta o `Authorization: Bearer` e, em
  `401`, limpa a sessão e redireciona para `/login`.
- **Design tokens** em `styles/tokens.ts` mapeados no `tailwind.config.ts` —
  nenhuma cor hardcoded. **Lucro sempre verde, prejuízo sempre vermelho**
  (`components/profit-value.tsx`).
- **Mobile-first**: layout funciona a partir de 375px, com grids responsivos.
- **Loading e erro** explícitos (skeletons + `StateMessage` com retry).
- **Acessibilidade**: labels associadas, `aria-invalid`, foco/teclado nos
  dialogs (Radix).

> **Nota sobre o contrato:** a API retorna mais campos do que o resumo do
> desafio sugere — `login` devolve `{ token, user }`, a lista traz
> `totalCost`/`assetsCount` e cada ativo expõe `unrealizedProfit`,
> `profitPercentage` e `marketValue`. O frontend está alinhado ao backend real
> (`apps/api`). A alocação da pizza é calculada no cliente a partir do
> `marketValue` dos ativos, já que o endpoint REST de detalhe retorna os ativos.
