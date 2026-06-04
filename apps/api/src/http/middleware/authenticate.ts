import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../domain/errors/DomainError';
import type { TokenService } from '../../domain/services/TokenService';

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(tokens: TokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing or malformed Authorization header'));
    }
    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = tokens.verify(token);
      req.user = { userId: payload.userId, email: payload.email };
      next();
    } catch (err) {
      next(err);
    }
  };
}
