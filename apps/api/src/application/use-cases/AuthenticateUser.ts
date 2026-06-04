import { UnauthorizedError } from '../../domain/errors/DomainError';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordHasher } from '../../domain/services/PasswordHasher';
import { TokenService } from '../../domain/services/TokenService';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  token: string;
  user: { id: string; email: string; name: string };
}

export class AuthenticateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const email = input.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const valid = await this.hasher.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const token = this.tokens.sign({ userId: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
