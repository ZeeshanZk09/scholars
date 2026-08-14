import type { Role, UserStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

export type UserSafe = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  status: UserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
};

export type CreateUserRecord = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
};

export type UpdateUserRecord = {
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
  status?: UserStatus;
};

export class UserRepository {
  async listAllSafe(): Promise<UserSafe[]> {
    const users = await prisma.user.findMany({
      select: USER_SAFE_SELECT,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return users as unknown as UserSafe[];
  }

  async listAll(options: { skip: number; take: number }) {
    const where = { deletedAt: null };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        select: USER_SAFE_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.user.count({ where }),
    ]);

    return { items: items as unknown as UserSafe[], total };
  }

  async findById(id: string): Promise<UserSafe | null> {
    const user = await prisma.user.findFirst({
      select: USER_SAFE_SELECT,
      where: { id, deletedAt: null },
    });

    return (user as unknown as UserSafe | null) ?? null;
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      select: { id: true },
      where: { email },
    });
  }

  async create(record: CreateUserRecord): Promise<{ id: string }> {
    return prisma.user.create({
      data: {
        name: record.name,
        email: record.email,
        passwordHash: record.passwordHash,
        role: record.role,
        status: record.status,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateUserRecord): Promise<UserSafe | null> {
    const result = await prisma.user.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.user.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
