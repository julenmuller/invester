import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';
import { AddAssetToPortfolio } from '../application/use-cases/AddAssetToPortfolio';
import { AuthenticateUser } from '../application/use-cases/AuthenticateUser';
import { CalculatePortfolioValue } from '../application/use-cases/CalculatePortfolioValue';
import { CreatePortfolio } from '../application/use-cases/CreatePortfolio';
import { GetPortfolio } from '../application/use-cases/GetPortfolio';
import { ListPortfolios } from '../application/use-cases/ListPortfolios';
import { RegisterUser } from '../application/use-cases/RegisterUser';
import type { TokenService } from '../domain/services/TokenService';
import { BrapiPriceProvider } from '../infrastructure/external/BrapiPriceProvider';
import { CachedPriceProvider } from '../infrastructure/external/CachedPriceProvider';
import { PrismaAssetRepository } from '../infrastructure/repositories/PrismaAssetRepository';
import { PrismaPortfolioRepository } from '../infrastructure/repositories/PrismaPortfolioRepository';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from '../infrastructure/services/BcryptPasswordHasher';
import { CryptoIdGenerator } from '../infrastructure/services/CryptoIdGenerator';
import { JwtTokenService } from '../infrastructure/services/JwtTokenService';

export interface Container {
  tokenService: TokenService;
  useCases: {
    registerUser: RegisterUser;
    authenticateUser: AuthenticateUser;
    createPortfolio: CreatePortfolio;
    addAssetToPortfolio: AddAssetToPortfolio;
    getPortfolio: GetPortfolio;
    listPortfolios: ListPortfolios;
    calculatePortfolioValue: CalculatePortfolioValue;
  };
}

export interface ContainerDeps {
  prisma: PrismaClient;
  redis: Redis;
  jwtSecret: string;
  brapiToken: string;
}

export function buildContainer(deps: ContainerDeps): Container {
  const users = new PrismaUserRepository(deps.prisma);
  const portfolios = new PrismaPortfolioRepository(deps.prisma);
  const assets = new PrismaAssetRepository(deps.prisma);

  const hasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(deps.jwtSecret);
  const ids = new CryptoIdGenerator();

  const prices = new CachedPriceProvider(
    new BrapiPriceProvider(deps.brapiToken),
    deps.redis,
  );

  return {
    tokenService,
    useCases: {
      registerUser: new RegisterUser(users, hasher, ids),
      authenticateUser: new AuthenticateUser(users, hasher, tokenService),
      createPortfolio: new CreatePortfolio(portfolios, ids),
      addAssetToPortfolio: new AddAssetToPortfolio(portfolios, assets, ids),
      getPortfolio: new GetPortfolio(portfolios, prices),
      listPortfolios: new ListPortfolios(portfolios),
      calculatePortfolioValue: new CalculatePortfolioValue(portfolios, prices),
    },
  };
}
