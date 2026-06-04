import { Asset } from '../../src/domain/entities/Asset';
import { AssetRepository } from '../../src/domain/repositories/AssetRepository';

export class InMemoryAssetRepository implements AssetRepository {
  public readonly saved: Asset[] = [];

  async save(asset: Asset): Promise<void> {
    this.saved.push(asset);
  }

  async findByPortfolioId(portfolioId: string): Promise<Asset[]> {
    return this.saved.filter((a) => a.portfolioId === portfolioId);
  }
}
