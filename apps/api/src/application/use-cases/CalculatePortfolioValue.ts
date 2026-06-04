import { NotFoundError, UnauthorizedError } from '../../domain/errors/DomainError';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';
import { PriceProvider } from '../../domain/services/PriceProvider';

export interface CalculatePortfolioValueInput {
  userId: string;
  portfolioId: string;
}

export interface AllocationItem {
  type: string;
  value: number;
  percentage: number;
}

export interface CalculatePortfolioValueOutput {
  portfolioId: string;
  totalValue: number;
  totalCost: number;
  totalProfit: number;
  allocation: AllocationItem[];
}

export class CalculatePortfolioValue {
  constructor(
    private readonly portfolios: PortfolioRepository,
    private readonly prices: PriceProvider,
  ) {}

  async execute(
    input: CalculatePortfolioValueInput,
  ): Promise<CalculatePortfolioValueOutput> {
    const portfolio = await this.portfolios.findById(input.portfolioId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio');
    }
    if (portfolio.userId !== input.userId) {
      throw new UnauthorizedError('You do not own this portfolio');
    }

    const valuesByType = new Map<string, number>();
    let totalValue = 0;

    for (const asset of portfolio.assets) {
      let price = asset.avgPrice;
      try {
        price = await this.prices.getCurrentPrice(asset.ticker);
      } catch {
        // fallback to avgPrice on provider failure
      }
      const value = asset.marketValue(price);
      totalValue += value;
      valuesByType.set(asset.type, (valuesByType.get(asset.type) ?? 0) + value);
    }

    const allocation: AllocationItem[] = Array.from(valuesByType.entries()).map(
      ([type, value]) => ({
        type,
        value,
        percentage: totalValue === 0 ? 0 : (value / totalValue) * 100,
      }),
    );

    const totalCost = portfolio.totalCost();

    return {
      portfolioId: portfolio.id,
      totalValue,
      totalCost,
      totalProfit: totalValue - totalCost,
      allocation,
    };
  }
}
