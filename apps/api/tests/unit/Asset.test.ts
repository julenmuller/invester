import { Asset } from '../../src/domain/entities/Asset';
import { DomainError } from '../../src/domain/errors/DomainError';

describe('Asset entity', () => {
  const baseProps = {
    id: 'a1',
    ticker: 'PETR4',
    type: 'STOCK' as const,
    quantity: 10,
    avgPrice: 30,
    portfolioId: 'p1',
  };

  describe('create()', () => {
    it('creates a valid asset', () => {
      const asset = Asset.create(baseProps);
      expect(asset.ticker).toBe('PETR4');
      expect(asset.type).toBe('STOCK');
      expect(asset.quantity).toBe(10);
      expect(asset.avgPrice).toBe(30);
    });

    it('uppercases and trims ticker', () => {
      const asset = Asset.create({ ...baseProps, ticker: '  petr4  ' });
      expect(asset.ticker).toBe('PETR4');
    });

    it('rejects ticker with invalid format', () => {
      expect(() => Asset.create({ ...baseProps, ticker: 'AB' })).toThrow(DomainError);
      expect(() => Asset.create({ ...baseProps, ticker: 'TOOLONGTICKER' })).toThrow(
        DomainError,
      );
      expect(() => Asset.create({ ...baseProps, ticker: 'pet$4' })).toThrow(DomainError);
    });

    it('rejects non-positive quantity', () => {
      expect(() => Asset.create({ ...baseProps, quantity: 0 })).toThrow(
        'Quantity must be greater than zero',
      );
      expect(() => Asset.create({ ...baseProps, quantity: -5 })).toThrow(DomainError);
      expect(() => Asset.create({ ...baseProps, quantity: NaN })).toThrow(DomainError);
    });

    it('rejects non-positive average price', () => {
      expect(() => Asset.create({ ...baseProps, avgPrice: 0 })).toThrow(DomainError);
      expect(() => Asset.create({ ...baseProps, avgPrice: -1 })).toThrow(DomainError);
    });

    it('rejects invalid type', () => {
      expect(() =>
        Asset.create({ ...baseProps, type: 'CRYPTO' as never }),
      ).toThrow(DomainError);
    });

    it('rejects missing portfolioId', () => {
      expect(() => Asset.create({ ...baseProps, portfolioId: '' })).toThrow(DomainError);
    });
  });

  describe('calculations', () => {
    const asset = Asset.create(baseProps);

    it('totalCost = quantity * avgPrice', () => {
      expect(asset.totalCost()).toBe(300);
    });

    it('unrealizedProfit at higher price', () => {
      expect(asset.unrealizedProfit(35)).toBe(50);
    });

    it('unrealizedProfit at lower price (loss)', () => {
      expect(asset.unrealizedProfit(25)).toBe(-50);
    });

    it('profitPercentage', () => {
      expect(asset.profitPercentage(36)).toBeCloseTo(20, 5);
      expect(asset.profitPercentage(30)).toBe(0);
    });

    it('marketValue = currentPrice * quantity', () => {
      expect(asset.marketValue(32)).toBe(320);
    });

    it('rejects negative current price', () => {
      expect(() => asset.unrealizedProfit(-1)).toThrow(DomainError);
      expect(() => asset.profitPercentage(-1)).toThrow(DomainError);
    });
  });
});
