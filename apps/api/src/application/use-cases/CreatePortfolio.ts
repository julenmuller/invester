import { Portfolio } from '../../domain/entities/Portfolio';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';
import { IdGenerator } from '../../domain/services/IdGenerator';

export interface CreatePortfolioInput {
  userId: string;
  name: string;
}

export interface CreatePortfolioOutput {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export class CreatePortfolio {
  constructor(
    private readonly portfolios: PortfolioRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreatePortfolioInput): Promise<CreatePortfolioOutput> {
    const portfolio = Portfolio.create({
      id: this.ids.generate(),
      name: input.name,
      userId: input.userId,
    });
    await this.portfolios.save(portfolio);
    return {
      id: portfolio.id,
      name: portfolio.name,
      userId: portfolio.userId,
      createdAt: portfolio.createdAt,
    };
  }
}
