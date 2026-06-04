import { Asset, AssetType } from '../../domain/entities/Asset';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/DomainError';
import { AssetRepository } from '../../domain/repositories/AssetRepository';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';
import { IdGenerator } from '../../domain/services/IdGenerator';

export interface AddAssetToPortfolioInput {
  userId: string;
  portfolioId: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
}

export interface AddAssetToPortfolioOutput {
  id: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
  portfolioId: string;
}

export class AddAssetToPortfolio {
  constructor(
    private readonly portfolios: PortfolioRepository,
    private readonly assets: AssetRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: AddAssetToPortfolioInput): Promise<AddAssetToPortfolioOutput> {
    const portfolio = await this.portfolios.findById(input.portfolioId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio');
    }
    if (portfolio.userId !== input.userId) {
      throw new UnauthorizedError('You do not own this portfolio');
    }

    const asset = Asset.create({
      id: this.ids.generate(),
      ticker: input.ticker,
      type: input.type,
      quantity: input.quantity,
      avgPrice: input.avgPrice,
      portfolioId: portfolio.id,
    });

    await this.assets.save(asset);

    return {
      id: asset.id,
      ticker: asset.ticker,
      type: asset.type,
      quantity: asset.quantity,
      avgPrice: asset.avgPrice,
      portfolioId: asset.portfolioId,
    };
  }
}
