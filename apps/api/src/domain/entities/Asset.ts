import { DomainError } from '../errors/DomainError';

export type AssetType = 'STOCK' | 'FII' | 'FIXED_INCOME';

const VALID_TYPES: readonly AssetType[] = ['STOCK', 'FII', 'FIXED_INCOME'];
const TICKER_REGEX = /^[A-Z0-9]{4,6}$/;

export interface AssetProps {
  id: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
  portfolioId: string;
}

export class Asset {
  private constructor(private readonly props: AssetProps) {}

  static create(props: {
    id: string;
    ticker: string;
    type: AssetType;
    quantity: number;
    avgPrice: number;
    portfolioId: string;
  }): Asset {
    const ticker = props.ticker.trim().toUpperCase();
    if (!TICKER_REGEX.test(ticker)) {
      throw new DomainError(
        `Invalid ticker "${props.ticker}". Expected 4-6 uppercase letters/digits.`,
      );
    }
    if (!VALID_TYPES.includes(props.type)) {
      throw new DomainError(`Invalid asset type "${props.type}"`);
    }
    if (!Number.isFinite(props.quantity) || props.quantity <= 0) {
      throw new DomainError('Quantity must be greater than zero');
    }
    if (!Number.isFinite(props.avgPrice) || props.avgPrice <= 0) {
      throw new DomainError('Average price must be greater than zero');
    }
    if (!props.portfolioId) {
      throw new DomainError('portfolioId is required');
    }
    return new Asset({
      id: props.id,
      ticker,
      type: props.type,
      quantity: props.quantity,
      avgPrice: props.avgPrice,
      portfolioId: props.portfolioId,
    });
  }

  get id(): string {
    return this.props.id;
  }
  get ticker(): string {
    return this.props.ticker;
  }
  get type(): AssetType {
    return this.props.type;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get avgPrice(): number {
    return this.props.avgPrice;
  }
  get portfolioId(): string {
    return this.props.portfolioId;
  }

  totalCost(): number {
    return this.props.quantity * this.props.avgPrice;
  }

  unrealizedProfit(currentPrice: number): number {
    this.assertValidPrice(currentPrice);
    return (currentPrice - this.props.avgPrice) * this.props.quantity;
  }

  profitPercentage(currentPrice: number): number {
    this.assertValidPrice(currentPrice);
    return ((currentPrice - this.props.avgPrice) / this.props.avgPrice) * 100;
  }

  marketValue(currentPrice: number): number {
    this.assertValidPrice(currentPrice);
    return currentPrice * this.props.quantity;
  }

  private assertValidPrice(price: number): void {
    if (!Number.isFinite(price) || price < 0) {
      throw new DomainError('Current price must be a non-negative finite number');
    }
  }
}
