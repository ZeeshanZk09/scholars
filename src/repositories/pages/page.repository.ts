import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

const PAGE_PUBLIC_SELECT = {
  id: true,
  title: true,
  slug: true,
  content: true,
  featuredImage: true,
  publishedAt: true,
  sections: {
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      title: true,
      content: true,
      type: true,
      displayOrder: true,
    },
  },
  seos: {
    select: {
      seoTitle: true,
      metaDescription: true,
      canonicalUrl: true,
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      robots: true,
    },
  },
} as const;

const PAGE_ADMIN_SELECT = {
  id: true,
  title: true,
  slug: true,
  content: true,
  featuredImage: true,
  layout: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  seos: {
    select: {
      seoTitle: true,
      metaDescription: true,
      canonicalUrl: true,
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      robots: true,
    },
  },
  _count: { select: { sections: true } },
} as const;

export type PagePublicRecord = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  sections: {
    id: string;
    title: string | null;
    content: string | null;
    type: string;
    displayOrder: number;
  }[];
  seos: {
    seoTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    robots: string | null;
  }[];
};

export type PageSeoRecord = {
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  robots: string | null;
};

export type PageAdminRecord = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  featuredImage: string | null;
  layout: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  seo: PageSeoRecord | null;
  sectionCount: number;
};

type RawPageAdmin = Omit<PageAdminRecord, "seo" | "sectionCount"> & {
  seos: PageSeoRecord[];
  _count: { sections: number };
};

export type CreatePageRecord = {
  title: string;
  slug: string;
  content: string | null;
  featuredImage: string | null;
  layout: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
  createdById: string | null;
  seo?: PageSeoRecord | null;
};

export type UpdatePageRecord = Partial<{
  title: string;
  slug: string;
  content: string | null;
  featuredImage: string | null;
  layout: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
  seo: PageSeoRecord | null;
  updatedById: string | null;
}>;

function toAdminRecord(raw: RawPageAdmin): PageAdminRecord {
  return {
    ...raw,
    seo: raw.seos[0] ?? null,
    sectionCount: raw._count.sections,
  };
}

export class PageRepository {
  async findPublishedBySlug(slug: string): Promise<PagePublicRecord | null> {
    const page = await prisma.page.findFirst({
      where: { slug, deletedAt: null, status: "PUBLISHED" },
      select: PAGE_PUBLIC_SELECT,
    });

    return (page as unknown as PagePublicRecord | null) ?? null;
  }

  async listAll(): Promise<PageAdminRecord[]> {
    const pages = await prisma.page.findMany({
      select: PAGE_ADMIN_SELECT,
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
    });

    return (pages as unknown as RawPageAdmin[]).map(toAdminRecord);
  }

  async findById(id: string): Promise<PageAdminRecord | null> {
    const page = await prisma.page.findFirst({
      select: PAGE_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    if (!page) {
      return null;
    }

    return toAdminRecord(page as unknown as RawPageAdmin);
  }

  async findBySlug(slug: string): Promise<{ id: string } | null> {
    return prisma.page.findFirst({
      select: { id: true },
      where: { slug, deletedAt: null },
    });
  }

  async create(record: CreatePageRecord): Promise<{ id: string }> {
    return prisma.page.create({
      data: {
        title: record.title,
        slug: record.slug,
        content: record.content,
        featuredImage: record.featuredImage,
        layout: record.layout,
        status: record.status,
        publishedAt: record.publishedAt,
        createdById: record.createdById,
        ...(record.seo ? { seos: { create: record.seo } } : {}),
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdatePageRecord): Promise<PageAdminRecord | null> {
    const data: Record<string, unknown> = { ...record };

    delete data.seo;
    delete data.updatedById;

    if (Object.keys(data).length > 0) {
      const result = await prisma.page.updateMany({
        where: { id },
        data: {
          ...data,
          updatedById: record.updatedById ?? undefined,
        },
      });

      if (result.count === 0) {
        return null;
      }
    }

    if (record.seo !== undefined) {
      if (record.seo === null) {
        await prisma.seoMeta.deleteMany({ where: { pageId: id } });
      } else {
        await prisma.seoMeta.upsert({
          where: { pageId: id },
          create: { pageId: id, ...record.seo },
          update: record.seo,
        });
      }
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.page.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
