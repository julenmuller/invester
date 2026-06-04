import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';

/** Defaults keep behavior unchanged for typical users while bounding load. */
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export interface ListPortfoliosInput {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface PortfolioListItem {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  totalCost: number;
  assetsCount: number;
}

export class ListPortfolios {
  constructor(private readonly portfolios: PortfolioRepository) {}

  async execute(input: ListPortfoliosInput): Promise<PortfolioListItem[]> {
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const offset = Math.max(input.offset ?? 0, 0);
    const portfolios = await this.portfolios.findByUserId(input.userId, {
      limit,
      offset,
    });
    return portfolios.map((p) => ({
      id: p.id,
      name: p.name,
      userId: p.userId,
      createdAt: p.createdAt,
      totalCost: p.totalCost(),
      assetsCount: p.assets.length,
    }));
  }
}
