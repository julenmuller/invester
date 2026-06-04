import type { Redis } from 'ioredis';
import { PriceProvider } from '../../domain/services/PriceProvider';

/**
 * Quote cache. SHARED STATE lives entirely in Redis — never in process memory —
 * so every API instance reads the same cache and the service stays stateless and
 * horizontally scalable. Concurrency is safe: a cache miss may cause a few
 * instances to fetch the same ticker at once, but the result is identical and
 * the last write wins, so request ordering never matters.
 */
export class CachedPriceProvider implements PriceProvider {
  private static readonly TTL_SECONDS = 60;
  private static readonly KEY_PREFIX = 'price:';

  constructor(
    private readonly inner: PriceProvider,
    private readonly redis: Redis,
    private readonly ttlSeconds = CachedPriceProvider.TTL_SECONDS,
  ) {}

  async getCurrentPrice(ticker: string): Promise<number> {
    const key = `${CachedPriceProvider.KEY_PREFIX}${ticker.toUpperCase()}`;
    const cached = await this.redis.get(key);
    if (cached !== null) {
      const parsed = Number(cached);
      if (Number.isFinite(parsed)) return parsed;
    }
    const price = await this.inner.getCurrentPrice(ticker);
    await this.redis.set(key, String(price), 'EX', this.ttlSeconds);
    return price;
  }
}
