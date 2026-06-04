import { Router } from 'express';
import { z } from 'zod';
import type { Container } from '../container';
import { validate } from '../middleware/validate';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(120),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function authRouter(container: Container): Router {
  const router = Router();

  router.post('/register', validate(registerSchema), async (req, res, next) => {
    try {
      const output = await container.useCases.registerUser.execute(req.body);
      res.status(201).json(output);
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
      const output = await container.useCases.authenticateUser.execute(req.body);
      res.status(200).json(output);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
