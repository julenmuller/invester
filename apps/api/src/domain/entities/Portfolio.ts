import { DomainError } from '../errors/DomainError';
import { Asset } from './Asset';

export interface PortfolioProps {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  assets: Asset[];
}

export class Portfolio {
  private constructor(private readonly props: PortfolioProps) {}

  static create(props: {
    id: string;
    name: string;
    userId: string;
    createdAt?: Date;
    assets?: Asset[];
  }): Portfolio {
    const name = props.name.trim();
    if (name.length < 2) {
      throw new DomainError('Portfolio name must have at least 2 characters');
    }
    if (!props.userId) {
      throw new DomainError('userId is required');
    }
    return new Portfolio({
      id: props.id,
      name,
      userId: props.userId,
      createdAt: props.createdAt ?? new Date(),
      assets: props.assets ?? [],
    });
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get userId(): string {
    return this.props.userId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get assets(): readonly Asset[] {
    return this.props.assets;
  }

  addAsset(asset: Asset): void {
    if (asset.portfolioId !== this.props.id) {
      throw new DomainError('Asset does not belong to this portfolio');
    }
    this.props.assets.push(asset);
  }

  totalCost(): number {
    return this.props.assets.reduce((sum, a) => sum + a.totalCost(), 0);
  }
}
