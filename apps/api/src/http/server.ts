import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import type { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express, { type Express, json } from 'express';
import type { Redis } from 'ioredis';
import pinoHttp from 'pino-http';
import { UnauthorizedError } from '../domain/errors/DomainError';
import { logger } from '../infrastructure/logger';
import type { Container } from './container';
import { resolvers, type GraphQLContext } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { healthRouter } from './routes/health';
import { portfoliosRouter } from './routes/portfolios';

export interface BuildServerOptions {
  container: Container;
  corsOrigin?: string;
  /** Concrete clients for readiness probes. */
  prisma: PrismaClient;
  redis: Redis;
  /** Lets `/ready` report 503 while the process is draining on SIGTERM. */
  isShuttingDown?: () => boolean;
}

export async function buildServer(options: BuildServerOptions): Promise<Express> {
  const { container } = options;
  const app: Express = express();

  app.use(pinoHttp({ logger }));
  app.use(
    cors({
      origin: options.corsOrigin ?? true,
      credentials: true,
    }),
  );
  app.use(json({ limit: '1mb' }));

  app.use(
    healthRouter({
      prisma: options.prisma,
      redis: options.redis,
      isShuttingDown: options.isShuttingDown ?? (() => false),
    }),
  );
  app.use('/auth', authRouter(container));
  app.use('/portfolios', portfoliosRouter(container));

  const apollo = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });
  await apollo.start();

  app.use(
    '/graphql',
    expressMiddleware(apollo, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
          return { container };
        }
        const token = header.slice('Bearer '.length).trim();
        try {
          const payload = container.tokenService.verify(token);
          return { container, user: payload };
        } catch {
          throw new UnauthorizedError('Invalid or expired token');
        }
      },
    }),
  );

  app.use(errorHandler);
  return app;
}
