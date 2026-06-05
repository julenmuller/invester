import { Router } from 'express';
import { z } from 'zod';
import { UnauthorizedError } from '../../domain/errors/DomainError';
import type { Container } from '../container';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';

const createPortfolioSchema = z.object({
  name: z.string().min(2).max(120),
});

const addAssetSchema = z.object({
  ticker: z.string().min(4).max(6),
  type: z.enum(['STOCK', 'FII', 'FIXED_INCOME']),
  quantity: z.number().positive(),
  avgPrice: z.number().positive(),
});

const portfolioIdSchema = z.object({
  id: z.string().uuid(),
});

const renamePortfolioSchema = z.object({
  name: z.string().min(2).max(60),
});

// Pagination for the list endpoint. Coerced from query strings; bounded so a
// single request can't pull the whole table under load.
const listQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export function portfoliosRouter(container: Container): Router {
  const router = Router();
  router.use(authenticate(container.tokenService));

  router.get('/', async (req, res, next) => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { limit, offset } = listQuerySchema.parse(req.query);
      const output = await container.useCases.listPortfolios.execute({
        userId: req.user.userId,
        limit,
        offset,
      });
      res.status(200).json(output);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', validate(createPortfolioSchema), async (req, res, next) => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const output = await container.useCases.createPortfolio.execute({
        userId: req.user.userId,
        name: req.body.name,
      });
      res.status(201).json(output);
    } catch (err) {
      next(err);
    }
  });

  router.patch(
    '/:id',
    validate(portfolioIdSchema, 'params'),
    validate(renamePortfolioSchema),
    async (req, res, next) => {
      try {
        if (!req.user) throw new UnauthorizedError();
        const output = await container.useCases.renamePortfolio.execute({
          userId: req.user.userId,
          portfolioId: String(req.params.id),
          name: req.body.name,
        });
        res.status(200).json(output);
      } catch (err) {
        next(err);
      }
    },
  );

  router.delete(
    '/:id',
    validate(portfolioIdSchema, 'params'),
    async (req, res, next) => {
      try {
        if (!req.user) throw new UnauthorizedError();
        await container.useCases.deletePortfolio.execute({
          userId: req.user.userId,
          portfolioId: String(req.params.id),
        });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  );

  router.get(
    '/:id',
    validate(portfolioIdSchema, 'params'),
    async (req, res, next) => {
      try {
        if (!req.user) throw new UnauthorizedError();
        const output = await container.useCases.getPortfolio.execute({
          userId: req.user.userId,
          portfolioId: String(req.params.id),
        });
        res.status(200).json(output);
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    '/:id/assets',
    validate(portfolioIdSchema, 'params'),
    validate(addAssetSchema),
    async (req, res, next) => {
      try {
        if (!req.user) throw new UnauthorizedError();
        const output = await container.useCases.addAssetToPortfolio.execute({
          userId: req.user.userId,
          portfolioId: String(req.params.id),
          ticker: req.body.ticker,
          type: req.body.type,
          quantity: req.body.quantity,
          avgPrice: req.body.avgPrice,
        });
        res.status(201).json(output);
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}
