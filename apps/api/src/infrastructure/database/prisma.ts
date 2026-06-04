import { PrismaClient } from '@prisma/client';

/**
 * Append a `connection_limit` to DATABASE_URL (unless already set) so Prisma's
 * pool is bounded per instance. This is what keeps N horizontally-scaled
 * instances from exhausting Postgres' max_connections. The pool itself is
 * process-local state — but it is NOT request state, so the API stays stateless
 * across requests; any instance can serve any request.
 */
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set(
        'connection_limit',
        process.env.DATABASE_CONNECTION_LIMIT ?? '10',
      );
    }
    return url.toString();
  } catch {
    // Leave malformed URLs untouched; config validation will surface the error.
    return raw;
  }
}

const datasourceUrl = resolveDatabaseUrl();

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
});

export type Prisma = typeof prisma;
