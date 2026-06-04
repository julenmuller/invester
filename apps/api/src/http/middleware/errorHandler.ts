import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  UnauthorizedError,
} from '../../domain/errors/DomainError';
import { BrapiError } from '../../infrastructure/external/BrapiPriceProvider';
import { logger } from '../../infrastructure/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid request payload',
      issues: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(400).json({ error: 'DomainError', message: err.message });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: 'Unauthorized', message: err.message });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: 'NotFound', message: err.message });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({ error: 'Conflict', message: err.message });
    return;
  }

  if (err instanceof BrapiError) {
    res.status(502).json({
      error: 'BrapiError',
      message: err.message,
      upstreamStatus: err.statusCode,
    });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'InternalServerError', message: 'Unexpected error' });
}
