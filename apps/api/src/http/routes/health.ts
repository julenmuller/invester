import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';
import { logger } from '../../infrastructure/logger';

export interface HealthDeps {
  prisma: PrismaClient;
  redis: Redis;
  /** True once SIGTERM handling has begun, so we stop advertising readiness. */
  isShuttingDown: () => boolean;
}

/**
 * Liveness (`/health`) and readiness (`/ready`) probes for orchestrators.
 *
 *  - `/health`: the process is alive. Cheap, no I/O — a failure here means
 *    "restart me".
 *  - `/ready`: the instance can serve traffic — its dependencies (Postgres and
 *    Redis) are reachable and we're not shutting down. A 503 here tells the load
 *    balancer to route around this instance without killing it.
 */
export function healthRouter(deps: HealthDeps): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/ready', async (_req, res) => {
    if (deps.isShuttingDown()) {
      res.status(503).json({ status: 'shutting_down' });
      return;
    }

    const checks = await Promise.allSettled([
      deps.prisma.$queryRaw`SELECT 1`,
      deps.redis.ping(),
    ]);

    const database = checks[0].status === 'fulfilled';
    const redis = checks[1].status === 'fulfilled';

    if (database && redis) {
      res.status(200).json({ status: 'ready', database: 'up', redis: 'up' });
      return;
    }

    logger.warn({ database, redis }, 'Readiness check failed');
    res.status(503).json({
      status: 'not_ready',
      database: database ? 'up' : 'down',
      redis: redis ? 'up' : 'down',
    });
  });

  return router;
}
