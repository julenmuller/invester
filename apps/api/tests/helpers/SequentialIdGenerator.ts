import { IdGenerator } from '../../src/domain/services/IdGenerator';

export class SequentialIdGenerator implements IdGenerator {
  private counter = 0;
  constructor(private readonly prefix = 'id') {}
  generate(): string {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}
