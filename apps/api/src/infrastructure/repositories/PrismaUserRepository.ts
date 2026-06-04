import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row
      ? User.create({
          id: row.id,
          email: row.email,
          name: row.name,
          passwordHash: row.passwordHash,
          createdAt: row.createdAt,
        })
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row
      ? User.create({
          id: row.id,
          email: row.email,
          name: row.name,
          passwordHash: row.passwordHash,
          createdAt: row.createdAt,
        })
      : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      },
    });
  }
}
