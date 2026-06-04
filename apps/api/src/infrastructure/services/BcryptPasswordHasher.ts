import bcrypt from 'bcrypt';
import { PasswordHasher } from '../../domain/services/PasswordHasher';

export class BcryptPasswordHasher implements PasswordHasher {
  private static readonly COST = 12;

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, BcryptPasswordHasher.COST);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
