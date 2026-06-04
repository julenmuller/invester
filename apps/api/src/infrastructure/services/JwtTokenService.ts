import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../domain/errors/DomainError';
import { TokenPayload, TokenService } from '../../domain/services/TokenService';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = '7d',
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        typeof (decoded as TokenPayload).userId === 'string' &&
        typeof (decoded as TokenPayload).email === 'string'
      ) {
        const d = decoded as TokenPayload;
        return { userId: d.userId, email: d.email };
      }
      throw new UnauthorizedError('Invalid token payload');
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
