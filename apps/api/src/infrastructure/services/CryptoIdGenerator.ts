import { randomUUID } from 'node:crypto';
import { IdGenerator } from '../../domain/services/IdGenerator';

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
