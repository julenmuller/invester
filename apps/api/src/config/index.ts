import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  /**
   * Max Postgres connections PER INSTANCE in Prisma's pool. Cap this so N
   * horizontally-scaled instances don't exhaust Postgres' max_connections
   * (roughly: instances × limit must stay under the server's max).
   */
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().positive().default(10),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  BRAPI_TOKEN: z.string().min(1, 'BRAPI_TOKEN is required'),
  WEB_URL: z.string().url().default('http://localhost:3000'),
});

export type AppConfig = z.infer<typeof envSchema>;

let cached: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
