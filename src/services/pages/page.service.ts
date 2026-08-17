import type { CreatePageInput, UpdatePageInput } from "@/schemas/pages/page.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { sanitizeRichHtml } from "@/lib/security/sanitize-html";
import { slugify } from "@/lib/utils/slug";
import { PageRepository, type PageAdminRecord, type PagePublicRecord } from "@/repositories/pages";

function toSeoRecord(seo: CreatePageInput["seo"] | undefined) {
  if (!seo) {
    return undefined;
  }

  return {
    seoTitle: seo.seoTitle || null,
    metaDescription: seo.metaDescription || null,
    canonicalUrl: seo.canonicalUrl || null,
    ogTitle: seo.ogTitle || null,
    ogDescription: seo.ogDescription || null,
    ogImage: seo.ogImage || null,
    robots: seo.robots || null,
  };
}

export class PageService {
  private readonly pageRepository: PageRepository;

  constructor(pageRepository = new PageRepository()) {
    this.pageRepository = pageRepository;
  }

  async getPublishedBySlug(slug: string): Promise<PagePublicRecord> {
    const page = await this.pageRepository.findPublishedBySlug(slug);

    if (!page) {
      throw new NotFoundError("Page not found.");
    }

    return page;
  }

  async listForAdmin(): Promise<PageAdminRecord[]> {
    return this.pageRepository.listAll();
  }

  async getById(id: string): Promise<PageAdminRecord> {
    const page = await this.pageRepository.findById(id);

    if (!page) {
      throw new NotFoundError("Page not found.");
    }

    return page;
  }

  async create(input: CreatePageInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.title);

    await this.assertSlugAvailable(slug);

    return this.pageRepository.create({
      title: input.title,
      slug,
      content: input.content ? sanitizeRichHtml(input.content) : null,
      featuredImage: input.featuredImage || null,
      layout: input.layout || null,
      status: input.status,
      publishedAt: input.publishedAt
        ? new Date(input.publishedAt)
        : input.status === "PUBLISHED"
          ? new Date()
          : null,
      createdById: actor.id,
      seo: toSeoRecord(input.seo),
    });
  }

  async update(id: string, input: UpdatePageInput, actor: ApiUser): Promise<PageAdminRecord> {
    if (input.slug) {
      await this.assertSlugAvailable(slugify(input.slug), id);
    }

    const page = await this.pageRepository.update(id, {
      title: input.title,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      content:
        input.content === undefined
          ? undefined
          : input.content
            ? sanitizeRichHtml(input.content)
            : null,
      featuredImage: input.featuredImage === undefined ? undefined : input.featuredImage || null,
      layout: input.layout === undefined ? undefined : input.layout || null,
      status: input.status,
      publishedAt:
        input.publishedAt === undefined
          ? undefined
          : input.publishedAt
            ? new Date(input.publishedAt)
            : null,
      seo: input.seo === undefined ? undefined : (toSeoRecord(input.seo ?? undefined) ?? null),
      updatedById: actor.id,
    });

    if (!page) {
      throw new NotFoundError("Page not found.");
    }

    return page;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.pageRepository.softDelete(id);

    if (!removed) {
      throw new NotFoundError("Page not found.");
    }
  }

  private async assertSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.pageRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A page with this slug already exists.");
    }
  }
}
