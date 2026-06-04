import { AddAssetToPortfolio } from '../../src/application/use-cases/AddAssetToPortfolio';
import { Portfolio } from '../../src/domain/entities/Portfolio';
import {
  NotFoundError,
  UnauthorizedError,
} from '../../src/domain/errors/DomainError';
import { InMemoryAssetRepository } from '../helpers/InMemoryAssetRepository';
import { InMemoryPortfolioRepository } from '../helpers/InMemoryPortfolioRepository';
import { SequentialIdGenerator } from '../helpers/SequentialIdGenerator';

describe('AddAssetToPortfolio use case', () => {
  let portfolios: InMemoryPortfolioRepository;
  let assets: InMemoryAssetRepository;
  let ids: SequentialIdGenerator;
  let useCase: AddAssetToPortfolio;

  beforeEach(() => {
    portfolios = new InMemoryPortfolioRepository();
    assets = new InMemoryAssetRepository();
    ids = new SequentialIdGenerator('asset');
    useCase = new AddAssetToPortfolio(portfolios, assets, ids);
  });

  it('adds an asset to an owned portfolio', async () => {
    const portfolio = Portfolio.create({
      id: 'p1',
      name: 'Growth',
      userId: 'u1',
    });
    await portfolios.save(portfolio);

    const result = await useCase.execute({
      userId: 'u1',
      portfolioId: 'p1',
      ticker: 'petr4',
      type: 'STOCK',
      quantity: 10,
      avgPrice: 30,
    });

    expect(result.ticker).toBe('PETR4');
    expect(result.id).toBe('asset-1');
    expect(assets.saved).toHaveLength(1);
    expect(assets.saved[0].totalCost()).toBe(300);
  });

  it('throws NotFoundError when portfolio does not exist', async () => {
    await expect(
      useCase.execute({
        userId: 'u1',
        portfolioId: 'missing',
        ticker: 'PETR4',
        type: 'STOCK',
        quantity: 10,
        avgPrice: 30,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws UnauthorizedError when user does not own portfolio', async () => {
    const portfolio = Portfolio.create({
      id: 'p1',
      name: 'Growth',
      userId: 'owner',
    });
    await portfolios.save(portfolio);

    await expect(
      useCase.execute({
        userId: 'intruder',
        portfolioId: 'p1',
        ticker: 'PETR4',
        type: 'STOCK',
        quantity: 10,
        avgPrice: 30,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);

    expect(assets.saved).toHaveLength(0);
  });

  it('propagates domain validation errors for invalid input', async () => {
    const portfolio = Portfolio.create({
      id: 'p1',
      name: 'Growth',
      userId: 'u1',
    });
    await portfolios.save(portfolio);

    await expect(
      useCase.execute({
        userId: 'u1',
        portfolioId: 'p1',
        ticker: 'PETR4',
        type: 'STOCK',
        quantity: -1,
        avgPrice: 30,
      }),
    ).rejects.toThrow('Quantity must be greater than zero');
  });
});
