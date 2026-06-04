import Redis from 'ioredis';
import { loadConfig } from './config';
import { buildContainer } from './http/container';
import { buildServer } from './http/server';
import { prisma } from './infrastructure/database/prisma';
import { logger } from './infrastructure/logger';

async function main(): Promise<void> {
  const config = loadConfig();

  const redis = new Redis(config.REDIS_URL, {
    lazyConnect: false,
    maxRetriesPerRequest: 3,
  });

  const container = buildContainer({
    prisma,
    redis,
    jwtSecret: config.JWT_SECRET,
    brapiToken: config.BRAPI_TOKEN,
  });

  // Flipped on SIGTERM so /ready starts returning 503 and the load balancer
  // drains this instance before it goes away — the key to zero-downtime deploys
  // and scaling events.
  let shuttingDown = false;

  const app = await buildServer({
    container,
    corsOrigin: config.WEB_URL,
    prisma,
    redis,
    isShuttingDown: () => shuttingDown,
  });

  const server = app.listen(config.PORT, () => {
    logger.info({ port: config.PORT }, 'InvestHub API listening');
  });

  /**
   * Graceful shutdown: stop accepting new connections, let in-flight requests
   * finish, then close DB/Redis. A hard timeout forces exit if draining stalls.
   */
  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'Shutting down — draining connections');

    const forceTimer = setTimeout(() => {
      logger.error('Graceful shutdown timed out; forcing exit');
      process.exit(1);
    }, 10_000);
    forceTimer.unref();

    try {
      // Stop accepting new connections; resolves once in-flight requests end.
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      await prisma.$disconnect();
      await redis.quit();
      logger.info('Shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error({ err }, 'Fatal startup error');
  process.exit(1);
});
