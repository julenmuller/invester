import { User } from '../../domain/entities/User';
import { ConflictError } from '../../domain/errors/DomainError';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { IdGenerator } from '../../domain/services/IdGenerator';
import { PasswordHasher } from '../../domain/services/PasswordHasher';

export interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  name: string;
}

export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const email = input.email.trim().toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user = User.create({
      id: this.ids.generate(),
      email,
      name: input.name,
      passwordHash,
    });

    await this.users.save(user);

    return { id: user.id, email: user.email, name: user.name };
  }
}
