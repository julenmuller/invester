import {
  NotFoundError,
  UnauthorizedError,
} from '../../domain/errors/DomainError';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';

export interface DeletePortfolioInput {
  portfolioId: string;
  userId: string;
}

export class DeletePortfolio {
  constructor(private readonly portfolios: PortfolioRepository) {}

  async execute(input: DeletePortfolioInput): Promise<void> {
    // Ownership check, same pattern as RenamePortfolio: distinguish "missing"
    // (404) from "not yours" (401) before deleting.
    const portfolio = await this.portfolios.findById(input.portfolioId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio');
    }
    if (portfolio.userId !== input.userId) {
      throw new UnauthorizedError('You do not own this portfolio');
    }

    await this.portfolios.delete(input.portfolioId, input.userId);
  }
}
