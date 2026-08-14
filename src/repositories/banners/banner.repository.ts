import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const BANNER_PUBLIC_SELECT = {
  id: true,
  title: true,
  subtitle: true,
  description: true,
  imageUrl: true,
  linkUrl: true,
  ctaLabel: true,
  startDate: true,
  endDate: true,
  displayOrder: true,
  publishedAt: true,
} as const;

export const BANNER_ADMIN_SELECT = {
  ...BANNER_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type BannerPublic = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  ctaLabel: string | null;
  startDate: Date | null;
  endDate: Date | null;
  displayOrder: number;
  publishedAt: Date | null;
};

export type BannerAdmin = BannerPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBannerRecord = {
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  ctaLabel: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateBannerRecord = Partial<
  Pick<
    BannerAdmin,
    | "title"
    | "subtitle"
    | "description"
    | "imageUrl"
    | "linkUrl"
    | "ctaLabel"
    | "startDate"
    | "endDate"
    | "status"
    | "displayOrder"
  >
> & { updatedById: string | null };

export class BannerRepository {
  async listPublished(): Promise<BannerPublic[]> {
    const now = new Date();

    const banners = await prisma.banner.findMany({
      select: BANNER_PUBLIC_SELECT,
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return banners as unknown as BannerPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.banner.findMany({
        select: BANNER_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.banner.count({ where }),
    ]);

    return { items: items as unknown as BannerAdmin[], total };
  }

  async findById(id: string): Promise<BannerAdmin | null> {
    const banner = await prisma.banner.findFirst({
      select: BANNER_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (banner as unknown as BannerAdmin | null) ?? null;
  }

  async create(record: CreateBannerRecord): Promise<{ id: string }> {
    return prisma.banner.create({
      data: {
        title: record.title,
        subtitle: record.subtitle,
        description: record.description,
        imageUrl: record.imageUrl,
        linkUrl: record.linkUrl,
        ctaLabel: record.ctaLabel,
        startDate: record.startDate,
        endDate: record.endDate,
        status: record.status,
        displayOrder: record.displayOrder,
        publishedAt: record.status === "PUBLISHED" ? new Date() : null,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateBannerRecord): Promise<BannerAdmin | null> {
    const result = await prisma.banner.updateMany({
      where: { id, deletedAt: null },
      data: {
        ...record,
        publishedAt: record.status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.banner.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
