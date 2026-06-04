import { Asset } from '../../src/domain/entities/Asset';
import { Portfolio } from '../../src/domain/entities/Portfolio';
import { DomainError } from '../../src/domain/errors/DomainError';

describe('Portfolio entity', () => {
  it('creates a valid portfolio', () => {
    const p = Portfolio.create({ id: 'p1', name: 'Long Term', userId: 'u1' });
    expect(p.name).toBe('Long Term');
    expect(p.assets).toEqual([]);
  });

  it('rejects short names', () => {
    expect(() => Portfolio.create({ id: 'p1', name: 'A', userId: 'u1' })).toThrow(
      DomainError,
    );
  });

  it('addAsset attaches assets that match portfolioId', () => {
    const p = Portfolio.create({ id: 'p1', name: 'Stocks', userId: 'u1' });
    const a = Asset.create({
      id: 'a1',
      ticker: 'VALE3',
      type: 'STOCK',
      quantity: 5,
      avgPrice: 60,
      portfolioId: 'p1',
    });
    p.addAsset(a);
    expect(p.assets).toHaveLength(1);
    expect(p.totalCost()).toBe(300);
  });

  it('addAsset rejects assets from other portfolios', () => {
    const p = Portfolio.create({ id: 'p1', name: 'Stocks', userId: 'u1' });
    const a = Asset.create({
      id: 'a1',
      ticker: 'VALE3',
      type: 'STOCK',
      quantity: 5,
      avgPrice: 60,
      portfolioId: 'other',
    });
    expect(() => p.addAsset(a)).toThrow(DomainError);
  });
});
