import { Asset } from '../entities/Asset';

export interface AssetRepository {
  save(asset: Asset): Promise<void>;
  findByPortfolioId(portfolioId: string): Promise<Asset[]>;
}
