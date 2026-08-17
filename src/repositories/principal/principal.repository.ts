import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const PRINCIPAL_PUBLIC_SELECT = {
  id: true,
  name: true,
  designation: true,
  profileImageUrl: true,
  message: true,
  biography: true,
  displayOrder: true,
} as const;

export const PRINCIPAL_ADMIN_SELECT = {
  ...PRINCIPAL_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PrincipalPublic = {
  id: string;
  name: string;
  designation: string | null;
  profileImageUrl: string | null;
  message: string;
  biography: string | null;
  displayOrder: number;
};

export type PrincipalAdmin = PrincipalPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePrincipalRecord = {
  name: string;
  designation: string | null;
  profileImageUrl: string | null;
  message: string;
  biography: string | null;
  status: ContentStatus;
  displayOrder: number;
};

export type UpdatePrincipalRecord = Partial<
  Pick<
    PrincipalAdmin,
    | "name"
    | "designation"
    | "profileImageUrl"
    | "message"
    | "biography"
    | "status"
    | "displayOrder"
  >
>;

export class PrincipalRepository {
  async listPublished(
    options: { take?: number } = {},
  ): Promise<PrincipalPublic[]> {
    const messages = await prisma.principalMessage.findMany({
      select: PRINCIPAL_PUBLIC_SELECT,
      where: { status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return messages as unknown as PrincipalPublic[];
  }

  async listAll(options: {
    skip: number;
    take: number;
    status?: ContentStatus;
  }) {
    const where = {
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.principalMessage.findMany({
        select: PRINCIPAL_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.principalMessage.count({ where }),
    ]);

    return { items: items as unknown as PrincipalAdmin[], total };
  }

  async findById(id: string): Promise<PrincipalAdmin | null> {
    const message = await prisma.principalMessage.findFirst({
      select: PRINCIPAL_ADMIN_SELECT,
      where: { id },
    });

    return (message as unknown as PrincipalAdmin | null) ?? null;
  }

  async create(record: CreatePrincipalRecord): Promise<{ id: string }> {
    return prisma.principalMessage.create({
      data: {
        name: record.name,
        designation: record.designation,
        profileImageUrl: record.profileImageUrl,
        message: record.message,
        biography: record.biography,
        status: record.status,
        displayOrder: record.displayOrder,
      },
      select: { id: true },
    });
  }

  async update(
    id: string,
    record: UpdatePrincipalRecord,
  ): Promise<PrincipalAdmin | null> {
    const result = await prisma.principalMessage.updateMany({
      where: { id },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await prisma.principalMessage.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }
}
