import { Portfolio } from '../entities/Portfolio';

/** Bounded result window for list queries, so we never load everything. */
export interface Pagination {
  /** Max rows to return. */
  limit: number;
  /** Rows to skip. */
  offset: number;
}

export interface PortfolioRepository {
  findById(id: string): Promise<Portfolio | null>;
  findByUserId(userId: string, pagination?: Pagination): Promise<Portfolio[]>;
  save(portfolio: Portfolio): Promise<void>;
}
