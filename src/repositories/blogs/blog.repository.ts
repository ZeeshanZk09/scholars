import type { BlogStatus, ContentStatus } from "@prisma/client";

import { slugify } from "@/lib/utils/slug";
import { prisma } from "@/server/db";

export const BLOG_SAFE_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  status: true,
  featuredImage: true,
  publishedAt: true,
  createdAt: true,
} as const;

export type BlogSafe = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: BlogStatus;
  featuredImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type CreateBlogRecord = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status: BlogStatus;
  authorId: string;
  createdById: string | null;
  categoryName?: string | null;
  tagIds?: string[];
  publishedAt?: Date | null;
  seo?: BlogSeoRecord | null;
};

export type CreateBlogCategoryRecord = {
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  createdById: string | null;
};

export type UpdateBlogCategoryRecord = {
  name?: string;
  description?: string | null;
  status?: ContentStatus;
};

export type CreateBlogTagRecord = {
  name: string;
  slug: string;
  createdById: string | null;
};

export type BlogPublicDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  status: BlogStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; name: string | null } | null;
  categories: { id: string; name: string; slug: string }[];
  seo: {
    seoTitle: string | null;
    metaDescription: string | null;
    keywords: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    robots: string | null;
  }[];
};

export type BlogSeoRecord = {
  seoTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  robots?: string | null;
};

const BLOG_DETAIL_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true } },
  categories: {
    select: {
      category: { select: { id: true, name: true, slug: true } },
    },
  },
  seo: {
    select: {
      seoTitle: true,
      metaDescription: true,
      keywords: true,
      canonicalUrl: true,
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      robots: true,
    },
  },
} as const;

export class BlogRepository {
  async listAllSafe(): Promise<BlogSafe[]> {
    const posts = await prisma.blogPost.findMany({
      select: BLOG_SAFE_SELECT,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return posts as unknown as BlogSafe[];
  }

  async listCategories(): Promise<{ id: string; name: string; slug: string }[]> {
    return prisma.blogCategory.findMany({
      select: { id: true, name: true, slug: true },
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: { displayOrder: "asc" },
    });
  }

  async listTags(): Promise<{ id: string; name: string; slug: string }[]> {
    return prisma.blogTag.findMany({
      select: { id: true, name: true, slug: true },
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async findCategoryBySlug(slug: string) {
    return prisma.blogCategory.findUnique({ where: { slug, deletedAt: null } });
  }

  async findTagBySlug(slug: string) {
    return prisma.blogTag.findUnique({ where: { slug, deletedAt: null } });
  }

  async findTagById(id: string) {
    return prisma.blogTag.findUnique({ where: { id, deletedAt: null } });
  }

  async listAllCategories(): Promise<
    {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      status: string;
      displayOrder: number;
    }[]
  > {
    return prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        displayOrder: true,
      },
      where: { deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
  }

  async listAllTags(): Promise<{ id: string; name: string; slug: string }[]> {
    return prisma.blogTag.findMany({
      select: { id: true, name: true, slug: true },
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async createCategory(record: CreateBlogCategoryRecord): Promise<{ id: string }> {
    return prisma.blogCategory.create({
      data: {
        name: record.name,
        slug: record.slug,
        description: record.description ?? null,
        status: record.status as never,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async updateCategory(id: string, record: UpdateBlogCategoryRecord): Promise<boolean> {
    const result = await prisma.blogCategory.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    return result.count > 0;
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await prisma.blogCategory.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  async createTag(record: CreateBlogTagRecord): Promise<{ id: string }> {
    return prisma.blogTag.create({
      data: {
        name: record.name,
        slug: record.slug,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async updateTag(id: string, name: string): Promise<boolean> {
    const result = await prisma.blogTag.updateMany({
      where: { id, deletedAt: null },
      data: { name },
    });

    return result.count > 0;
  }

  async deleteTag(id: string): Promise<boolean> {
    try {
      await prisma.blogTag.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  async findPostBySlug(slug: string) {
    return prisma.blogPost.findUnique({ where: { slug } });
  }

  /**
   * Creates a blog post. When a categoryName is provided, the category is
   * resolved (or created) and linked atomically with the post.
   */
  async create(record: CreateBlogRecord): Promise<{ id: string }> {
    return prisma.$transaction(async (tx) => {
      let categoryId: string | null = null;

      if (record.categoryName) {
        const slug = slugify(record.categoryName);
        const existing = await tx.blogCategory.findUnique({ where: { slug } });

        if (existing) {
          categoryId = existing.id;
        } else {
          const created = await tx.blogCategory.create({
            data: {
              name: record.categoryName,
              slug,
              createdById: record.createdById,
              status: "PUBLISHED",
            },
          });
          categoryId = created.id;
        }
      }

      const post = await tx.blogPost.create({
        data: {
          title: record.title,
          slug: record.slug,
          excerpt: record.excerpt ?? null,
          content: record.content,
          featuredImage: record.featuredImage ?? null,
          status: record.status,
          publishedAt:
            record.status === "PUBLISHED"
              ? (record.publishedAt ?? new Date())
              : (record.publishedAt ?? null),
          authorId: record.authorId,
          createdById: record.createdById,
          categories: categoryId === null ? undefined : { create: [{ categoryId }] },
          tags:
            record.tagIds && record.tagIds.length > 0
              ? {
                  create: record.tagIds.map((tagId) => ({
                    tagId,
                  })),
                }
              : undefined,
        },
        select: { id: true },
      });

      if (record.seo) {
        const seoFields = normalizeSeo(record.seo);
        await tx.seoMeta.create({
          data: { blogPostId: post.id, ...seoFields },
        });
      }

      return post;
    });
  }

  async listPublished(options: { skip: number; take: number }) {
    const where = { deletedAt: null, status: "PUBLISHED" as const };

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        select: BLOG_SAFE_SELECT,
        where,
        orderBy: { publishedAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { items: items as unknown as BlogSafe[], total };
  }

  async findPublishedBySlug(slug: string): Promise<BlogPublicDetail | null> {
    const post = await prisma.blogPost.findFirst({
      where: { slug, deletedAt: null, status: "PUBLISHED" },
      select: BLOG_DETAIL_SELECT,
    });

    if (!post) {
      return null;
    }

    return {
      ...post,
      categories: post.categories.map((c) => c.category),
    } as unknown as BlogPublicDetail;
  }

  async findById(id: string): Promise<BlogPublicDetail | null> {
    const post = await prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      select: BLOG_DETAIL_SELECT,
    });

    if (!post) {
      return null;
    }

    return {
      ...post,
      categories: post.categories.map((c) => c.category),
    } as unknown as BlogPublicDetail;
  }

  async update(
    id: string,
    record: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string;
      featuredImage?: string | null;
      status?: BlogStatus;
      publishedAt?: Date | null;
      tagIds?: string[];
      seo?: BlogSeoRecord | null;
      updatedById: string | null;
    }
  ): Promise<BlogPublicDetail | null> {
    const { tagIds, ...rest } = record;

    const result = await prisma.blogPost.updateMany({
      where: { id, deletedAt: null },
      data: {
        ...rest,
        publishedAt:
          record.status === "PUBLISHED"
            ? (record.publishedAt ?? new Date())
            : record.publishedAt === undefined
              ? undefined
              : null,
      },
    });

    if (result.count === 0) {
      return null;
    }

    if (tagIds !== undefined) {
      await prisma.blogPost.update({
        where: { id },
        data: {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
        },
      });
    }

    if (record.seo) {
      const seoFields = normalizeSeo(record.seo);
      await prisma.seoMeta.upsert({
        where: { blogPostId: id },
        update: { ...seoFields },
        create: { blogPostId: id, ...seoFields },
      });
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.blogPost.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}

function normalizeSeo(seo: BlogSeoRecord) {
  return {
    seoTitle: seo.seoTitle === undefined ? null : seo.seoTitle || null,
    metaDescription: seo.metaDescription === undefined ? null : seo.metaDescription || null,
    keywords: seo.keywords === undefined ? null : seo.keywords || null,
    canonicalUrl: seo.canonicalUrl === undefined ? null : seo.canonicalUrl || null,
    ogTitle: seo.ogTitle === undefined ? null : seo.ogTitle || null,
    ogDescription: seo.ogDescription === undefined ? null : seo.ogDescription || null,
    ogImage: seo.ogImage === undefined ? null : seo.ogImage || null,
    robots: seo.robots === undefined ? null : seo.robots || null,
  };
}
