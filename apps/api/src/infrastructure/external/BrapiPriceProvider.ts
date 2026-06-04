import { PriceProvider } from '../../domain/services/PriceProvider';

export class BrapiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly ticker?: string,
  ) {
    super(message);
    this.name = 'BrapiError';
  }
}

interface BrapiResponse {
  results?: Array<{
    symbol: string;
    regularMarketPrice?: number;
  }>;
}

export class BrapiPriceProvider implements PriceProvider {
  private static readonly BASE_URL = 'https://brapi.dev/api/quote';
  private static readonly TIMEOUT_MS = 5000;

  constructor(private readonly token: string) {
    if (!token) {
      throw new Error('BrapiPriceProvider requires a token');
    }
  }

  async getCurrentPrice(ticker: string): Promise<number> {
    const url = `${BrapiPriceProvider.BASE_URL}/${encodeURIComponent(
      ticker,
    )}?token=${encodeURIComponent(this.token)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(BrapiPriceProvider.TIMEOUT_MS),
        headers: { Accept: 'application/json' },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      throw new BrapiError(`Failed to reach Brapi: ${msg}`, 0, ticker);
    }

    if (!response.ok) {
      throw new BrapiError(
        `Brapi responded with ${response.status} for ${ticker}`,
        response.status,
        ticker,
      );
    }

    const body = (await response.json()) as BrapiResponse;
    const price = body.results?.[0]?.regularMarketPrice;
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      throw new BrapiError(`No price returned for ${ticker}`, 502, ticker);
    }
    return price;
  }
}
