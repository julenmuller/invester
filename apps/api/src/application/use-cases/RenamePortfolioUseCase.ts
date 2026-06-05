import {
  DomainError,
  NotFoundError,
  UnauthorizedError,
} from '../../domain/errors/DomainError';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';

export interface RenamePortfolioInput {
  portfolioId: string;
  userId: string;
  name: string;
}

export interface RenamePortfolioOutput {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export class RenamePortfolioUseCase {
  constructor(private readonly portfolios: PortfolioRepository) {}

  async execute(input: RenamePortfolioInput): Promise<RenamePortfolioOutput> {
    const name = input.name.trim();
    if (name.length < 2 || name.length > 60) {
      throw new DomainError('Portfolio name must be between 2 and 60 characters');
    }

    // Ownership check, same pattern as GetPortfolio: distinguish "missing"
    // (404) from "not yours" (401) before mutating.
    const portfolio = await this.portfolios.findById(input.portfolioId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio');
    }
    if (portfolio.userId !== input.userId) {
      throw new UnauthorizedError('You do not own this portfolio');
    }

    const updated = await this.portfolios.updateName(
      input.portfolioId,
      name,
      input.userId,
    );
    return {
      id: updated.id,
      name: updated.name,
      userId: updated.userId,
      createdAt: updated.createdAt,
    };
  }
}
