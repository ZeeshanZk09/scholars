import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const FACILITY_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  icon: true,
  displayOrder: true,
} as const;

export const FACILITY_ADMIN_SELECT = {
  ...FACILITY_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type FacilityPublic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  displayOrder: number;
};

export type FacilityAdmin = FacilityPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateFacilityRecord = {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateFacilityRecord = Partial<
  Pick<
    FacilityAdmin,
    "name" | "slug" | "description" | "imageUrl" | "icon" | "status" | "displayOrder"
  >
> & { updatedById: string | null };

export class FacilityRepository {
  async listPublished(options: { take?: number } = {}): Promise<FacilityPublic[]> {
    const facilities = await prisma.facility.findMany({
      select: FACILITY_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return facilities as unknown as FacilityPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.facility.findMany({
        select: FACILITY_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.facility.count({ where }),
    ]);

    return { items: items as unknown as FacilityAdmin[], total };
  }

  async findById(id: string): Promise<FacilityAdmin | null> {
    const facility = await prisma.facility.findFirst({
      select: FACILITY_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (facility as unknown as FacilityAdmin | null) ?? null;
  }

  async findBySlug(slug: string) {
    return prisma.facility.findUnique({
      select: { id: true },
      where: { slug },
    });
  }

  async create(record: CreateFacilityRecord): Promise<{ id: string }> {
    return prisma.facility.create({
      data: {
        name: record.name,
        slug: record.slug,
        description: record.description,
        imageUrl: record.imageUrl,
        icon: record.icon,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateFacilityRecord): Promise<FacilityAdmin | null> {
    const result = await prisma.facility.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.facility.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
