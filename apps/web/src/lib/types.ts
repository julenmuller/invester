/**
 * Shapes returned by the InvestHub REST API (apps/api). These mirror the
 * backend use-case outputs exactly so the frontend and backend stay in sync.
 */

export type AssetType = 'STOCK' | 'FII' | 'FIXED_INCOME';

export const ASSET_TYPES: AssetType[] = ['STOCK', 'FII', 'FIXED_INCOME'];

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  STOCK: 'Ação',
  FII: 'FII',
  FIXED_INCOME: 'Renda Fixa',
};

/** Authenticated user, returned alongside the token on login. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/** POST /auth/register response. */
export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

/** POST /auth/login response. */
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Item of GET /portfolios. */
export interface PortfolioListItem {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  totalCost: number;
  assetsCount: number;
}

/** Asset row inside GET /portfolios/:id. */
export interface AssetSnapshot {
  id: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedProfit: number;
  profitPercentage: number;
}

/** GET /portfolios/:id response. */
export interface PortfolioDetail {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  totalCost: number;
  totalValue: number;
  totalProfit: number;
  assets: AssetSnapshot[];
}

/** POST /portfolios body. */
export interface CreatePortfolioInput {
  name: string;
}

/** POST /portfolios/:id/assets body. */
export interface AddAssetInput {
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
}

/** Standard error body returned by the API error handler. */
export interface ApiError {
  error: string;
  message: string;
  issues?: { path: string; message: string }[];
}
