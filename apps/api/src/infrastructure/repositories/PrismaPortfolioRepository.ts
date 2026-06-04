import { PrismaClient } from '@prisma/client';
import { Asset, AssetType } from '../../domain/entities/Asset';
import { Portfolio } from '../../domain/entities/Portfolio';
import {
  PortfolioRepository,
  type Pagination,
} from '../../domain/repositories/PortfolioRepository';

export class PrismaPortfolioRepository implements PortfolioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Portfolio | null> {
    const row = await this.prisma.portfolio.findUnique({
      where: { id },
      include: { assets: true },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByUserId(
    userId: string,
    pagination?: Pagination,
  ): Promise<Portfolio[]> {
    const rows = await this.prisma.portfolio.findMany({
      where: { userId },
      include: { assets: true },
      orderBy: { createdAt: 'desc' },
      // Bound the result set so a single response can't load everything.
      take: pagination?.limit,
      skip: pagination?.offset,
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(portfolio: Portfolio): Promise<void> {
    await this.prisma.portfolio.upsert({
      where: { id: portfolio.id },
      update: { name: portfolio.name },
      create: {
        id: portfolio.id,
        name: portfolio.name,
        userId: portfolio.userId,
        createdAt: portfolio.createdAt,
      },
    });
  }

  private toDomain(row: {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    assets: Array<{
      id: string;
      ticker: string;
      type: string;
      quantity: unknown;
      avgPrice: unknown;
      portfolioId: string;
    }>;
  }): Portfolio {
    const assets = row.assets.map((a) =>
      Asset.create({
        id: a.id,
        ticker: a.ticker,
        type: a.type as AssetType,
        quantity: Number(a.quantity),
        avgPrice: Number(a.avgPrice),
        portfolioId: a.portfolioId,
      }),
    );
    return Portfolio.create({
      id: row.id,
      name: row.name,
      userId: row.userId,
      createdAt: row.createdAt,
      assets,
    });
  }
}
