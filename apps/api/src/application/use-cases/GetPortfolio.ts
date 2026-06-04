import { AssetType } from '../../domain/entities/Asset';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/DomainError';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';
import { PriceProvider } from '../../domain/services/PriceProvider';

export interface GetPortfolioInput {
  userId: string;
  portfolioId: string;
}

export interface AssetSnapshot {
  id: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedProfit: number;
  profitPercentage: number;
}

export interface GetPortfolioOutput {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  totalCost: number;
  totalValue: number;
  totalProfit: number;
  assets: AssetSnapshot[];
}

export class GetPortfolio {
  constructor(
    private readonly portfolios: PortfolioRepository,
    private readonly prices: PriceProvider,
  ) {}

  async execute(input: GetPortfolioInput): Promise<GetPortfolioOutput> {
    const portfolio = await this.portfolios.findById(input.portfolioId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio');
    }
    if (portfolio.userId !== input.userId) {
      throw new UnauthorizedError('You do not own this portfolio');
    }

    const snapshots = await Promise.all(
      portfolio.assets.map(async (asset) => {
        const currentPrice = await this.safeFetchPrice(asset.ticker, asset.avgPrice);
        return {
          id: asset.id,
          ticker: asset.ticker,
          type: asset.type,
          quantity: asset.quantity,
          avgPrice: asset.avgPrice,
          currentPrice,
          marketValue: asset.marketValue(currentPrice),
          unrealizedProfit: asset.unrealizedProfit(currentPrice),
          profitPercentage: asset.profitPercentage(currentPrice),
        };
      }),
    );

    const totalCost = snapshots.reduce((sum, s) => sum + s.quantity * s.avgPrice, 0);
    const totalValue = snapshots.reduce((sum, s) => sum + s.marketValue, 0);

    return {
      id: portfolio.id,
      name: portfolio.name,
      userId: portfolio.userId,
      createdAt: portfolio.createdAt,
      totalCost,
      totalValue,
      totalProfit: totalValue - totalCost,
      assets: snapshots,
    };
  }

  private async safeFetchPrice(ticker: string, fallback: number): Promise<number> {
    try {
      return await this.prices.getCurrentPrice(ticker);
    } catch {
      return fallback;
    }
  }
}
