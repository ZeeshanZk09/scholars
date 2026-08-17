import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const MANAGEMENT_PUBLIC_SELECT = {
  id: true,
  name: true,
  designation: true,
  imageUrl: true,
  biography: true,
  displayOrder: true,
} as const;

export const MANAGEMENT_ADMIN_SELECT = {
  ...MANAGEMENT_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ManagementPublic = {
  id: string;
  name: string;
  designation: string | null;
  imageUrl: string | null;
  biography: string | null;
  displayOrder: number;
};

export type ManagementAdmin = ManagementPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateManagementRecord = {
  name: string;
  designation: string | null;
  imageUrl: string | null;
  biography: string | null;
  status: ContentStatus;
  displayOrder: number;
};

export type UpdateManagementRecord = Partial<
  Pick<
    ManagementAdmin,
    "name" | "designation" | "imageUrl" | "biography" | "status" | "displayOrder"
  >
>;

export class ManagementRepository {
  async listPublished(options: { take?: number } = {}): Promise<ManagementPublic[]> {
    const members = await prisma.managementMember.findMany({
      select: MANAGEMENT_PUBLIC_SELECT,
      where: { status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return members as unknown as ManagementPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.managementMember.findMany({
        select: MANAGEMENT_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.managementMember.count({ where }),
    ]);

    return { items: items as unknown as ManagementAdmin[], total };
  }

  async findById(id: string): Promise<ManagementAdmin | null> {
    const member = await prisma.managementMember.findFirst({
      select: MANAGEMENT_ADMIN_SELECT,
      where: { id },
    });

    return (member as unknown as ManagementAdmin | null) ?? null;
  }

  async create(record: CreateManagementRecord): Promise<{ id: string }> {
    return prisma.managementMember.create({
      data: {
        name: record.name,
        designation: record.designation,
        imageUrl: record.imageUrl,
        biography: record.biography,
        status: record.status,
        displayOrder: record.displayOrder,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateManagementRecord): Promise<ManagementAdmin | null> {
    const result = await prisma.managementMember.updateMany({
      where: { id },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await prisma.managementMember.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }
}
