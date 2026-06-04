import { PrismaClient, AssetType as PrismaAssetType } from '@prisma/client';
import { Asset, AssetType } from '../../domain/entities/Asset';
import { AssetRepository } from '../../domain/repositories/AssetRepository';

export class PrismaAssetRepository implements AssetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(asset: Asset): Promise<void> {
    await this.prisma.asset.upsert({
      where: { id: asset.id },
      update: {
        ticker: asset.ticker,
        type: asset.type as PrismaAssetType,
        quantity: asset.quantity,
        avgPrice: asset.avgPrice,
      },
      create: {
        id: asset.id,
        ticker: asset.ticker,
        type: asset.type as PrismaAssetType,
        quantity: asset.quantity,
        avgPrice: asset.avgPrice,
        portfolioId: asset.portfolioId,
      },
    });
  }

  async findByPortfolioId(portfolioId: string): Promise<Asset[]> {
    const rows = await this.prisma.asset.findMany({ where: { portfolioId } });
    return rows.map((a) =>
      Asset.create({
        id: a.id,
        ticker: a.ticker,
        type: a.type as AssetType,
        quantity: Number(a.quantity),
        avgPrice: Number(a.avgPrice),
        portfolioId: a.portfolioId,
      }),
    );
  }
}
