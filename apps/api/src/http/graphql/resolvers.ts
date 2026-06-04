import { UnauthorizedError } from '../../domain/errors/DomainError';
import type { Container } from '../container';

export interface GraphQLContext {
  container: Container;
  user?: { userId: string; email: string };
}

function requireUser(ctx: GraphQLContext): { userId: string; email: string } {
  if (!ctx.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return ctx.user;
}

export const resolvers = {
  Query: {
    portfolio: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const user = requireUser(ctx);
      return ctx.container.useCases.getPortfolio.execute({
        userId: user.userId,
        portfolioId: args.id,
      });
    },
    portfolios: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const user = requireUser(ctx);
      return ctx.container.useCases.listPortfolios.execute({ userId: user.userId });
    },
  },
  Mutation: {
    addAsset: async (
      _parent: unknown,
      args: {
        portfolioId: string;
        input: {
          ticker: string;
          type: 'STOCK' | 'FII' | 'FIXED_INCOME';
          quantity: number;
          avgPrice: number;
        };
      },
      ctx: GraphQLContext,
    ) => {
      const user = requireUser(ctx);
      return ctx.container.useCases.addAssetToPortfolio.execute({
        userId: user.userId,
        portfolioId: args.portfolioId,
        ticker: args.input.ticker,
        type: args.input.type,
        quantity: args.input.quantity,
        avgPrice: args.input.avgPrice,
      });
    },
  },
  Portfolio: {
    createdAt: (parent: { createdAt: Date | string }) =>
      parent.createdAt instanceof Date
        ? parent.createdAt.toISOString()
        : parent.createdAt,
  },
  PortfolioListItem: {
    createdAt: (parent: { createdAt: Date | string }) =>
      parent.createdAt instanceof Date
        ? parent.createdAt.toISOString()
        : parent.createdAt,
  },
};
