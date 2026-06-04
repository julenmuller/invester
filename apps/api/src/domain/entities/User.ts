import { DomainError } from '../errors/DomainError';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    createdAt?: Date;
  }): User {
    const email = props.email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      throw new DomainError('Invalid email address');
    }
    const name = props.name.trim();
    if (name.length < 2) {
      throw new DomainError('Name must have at least 2 characters');
    }
    if (!props.passwordHash || props.passwordHash.length < 10) {
      throw new DomainError('Password hash is required');
    }
    return new User({
      id: props.id,
      email,
      name,
      passwordHash: props.passwordHash,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }
  get email(): string {
    return this.props.email;
  }
  get name(): string {
    return this.props.name;
  }
  get passwordHash(): string {
    return this.props.passwordHash;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
}
