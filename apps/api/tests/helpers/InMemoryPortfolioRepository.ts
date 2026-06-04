import { Portfolio } from '../../src/domain/entities/Portfolio';
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
}
