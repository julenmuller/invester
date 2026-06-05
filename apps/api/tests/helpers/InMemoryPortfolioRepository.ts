import { Portfolio } from '../../src/domain/entities/Portfolio';
import { NotFoundError } from '../../src/domain/errors/DomainError';
import {
  PortfolioRepository,
  type Pagination,
} from '../../src/domain/repositories/PortfolioRepository';

export class InMemoryPortfolioRepository implements PortfolioRepository {
  private store = new Map<string, Portfolio>();

  async findById(id: string): Promise<Portfolio | null> {
    return this.store.get(id) ?? null;
  }

  async findByUserId(
    userId: string,
    pagination?: Pagination,
  ): Promise<Portfolio[]> {
    const all = Array.from(this.store.values()).filter(
      (p) => p.userId === userId,
    );
    if (!pagination) return all;
    return all.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async save(portfolio: Portfolio): Promise<void> {
    this.store.set(portfolio.id, portfolio);
  }

  async updateName(
    id: string,
    name: string,
    userId: string,
  ): Promise<Portfolio> {
    const existing = this.store.get(id);
    // Ownership scoped like the Prisma version: missing OR not owned => 404.
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError('Portfolio');
    }
    const updated = Portfolio.create({
      id: existing.id,
      name,
      userId: existing.userId,
      createdAt: existing.createdAt,
      assets: [...existing.assets],
    });
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = this.store.get(id);
    // Ownership scoped like the Prisma version: missing OR not owned => 404.
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError('Portfolio');
    }
    this.store.delete(id);
  }
}
