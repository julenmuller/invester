import { User } from '../../src/domain/entities/User';
import { DomainError } from '../../src/domain/errors/DomainError';

describe('User entity', () => {
  const validProps = {
    id: 'u1',
    email: 'jane@example.com',
    name: 'Jane Doe',
    passwordHash: '$2b$12$abcdefghijklmnopqrstuv',
  };

  it('creates a valid user', () => {
    const user = User.create(validProps);
    expect(user.email).toBe('jane@example.com');
    expect(user.name).toBe('Jane Doe');
  });

  it('lowercases email', () => {
    const user = User.create({ ...validProps, email: 'JANE@Example.COM' });
    expect(user.email).toBe('jane@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => User.create({ ...validProps, email: 'not-an-email' })).toThrow(
      DomainError,
    );
  });

  it('rejects short name', () => {
    expect(() => User.create({ ...validProps, name: 'A' })).toThrow(DomainError);
  });

  it('rejects missing password hash', () => {
    expect(() => User.create({ ...validProps, passwordHash: '' })).toThrow(DomainError);
  });
});
