export const typeDefs = /* GraphQL */ `
  enum AssetType {
    STOCK
    FII
    FIXED_INCOME
  }

  type AssetSnapshot {
    id: ID!
    ticker: String!
    type: AssetType!
    quantity: Float!
    avgPrice: Float!
    currentPrice: Float!
    marketValue: Float!
    unrealizedProfit: Float!
    profitPercentage: Float!
  }

  type Portfolio {
    id: ID!
    name: String!
    userId: ID!
    createdAt: String!
    totalCost: Float!
    totalValue: Float!
    totalProfit: Float!
    assets: [AssetSnapshot!]!
  }

  type PortfolioListItem {
    id: ID!
    name: String!
    userId: ID!
    createdAt: String!
    totalCost: Float!
    assetsCount: Int!
  }

  input AddAssetInput {
    ticker: String!
    type: AssetType!
    quantity: Float!
    avgPrice: Float!
  }

  type AssetMutationResult {
    id: ID!
    ticker: String!
    type: AssetType!
    quantity: Float!
    avgPrice: Float!
    portfolioId: ID!
  }

  type Query {
    portfolio(id: ID!): Portfolio!
    portfolios: [PortfolioListItem!]!
  }

  type Mutation {
    addAsset(portfolioId: ID!, input: AddAssetInput!): AssetMutationResult!
  }
`;
