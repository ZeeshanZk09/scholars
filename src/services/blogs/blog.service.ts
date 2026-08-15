import { ConflictError, NotFoundError } from "@/lib/errors";
import { sanitizeRichHtml } from "@/lib/security/sanitize-html";
import { slugify } from "@/lib/utils/slug";
import { BlogRepository, type BlogPublicDetail, type BlogSafe } from "@/repositories/blogs";
import type { CreateBlogInput, UpdateBlogInput } from "@/schemas/blog/blog.schema";
import type { ApiUser } from "@/server/auth/route-guard";

export class BlogService {
  private readonly blogRepository: BlogRepository;

  constructor(blogRepository = new BlogRepository()) {
    this.blogRepository = blogRepository;
  }

  async listBlogs(): Promise<BlogSafe[]> {
    return this.blogRepository.listAllSafe();
  }

  async listPublished(options: { skip: number; take: number }) {
    return this.blogRepository.listPublished(options);
  }

  async listCategories() {
    return this.blogRepository.listCategories();
  }

  async getPublishedBySlug(slug: string): Promise<BlogPublicDetail> {
    const post = await this.blogRepository.findPublishedBySlug(slug);

    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }

    return post;
  }

  async getById(id: string): Promise<BlogPublicDetail> {
    const post = await this.blogRepository.findById(id);

    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }

    return post;
  }

  async createBlog(input: CreateBlogInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.title);

    const existing = await this.blogRepository.findPostBySlug(slug);
    if (existing) {
      throw new ConflictError("A blog post with this slug already exists.");
    }

    return this.blogRepository.create({
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      content: sanitizeRichHtml(input.content),
      featuredImage: input.featuredImage || null,
      status: input.status,
      categoryName: input.categoryName || null,
      authorId: actor.id,
      createdById: actor.id,
      publishedAt: input.publishedAt ?? null,
      seo: input.seo ?? null,
    });
  }

  async updateBlog(id: string, input: UpdateBlogInput, actor: ApiUser): Promise<BlogPublicDetail> {
    await this.getById(id);

    if (input.slug) {
      const slug = slugify(input.slug);
      const existing = await this.blogRepository.findPostBySlug(slug);
      if (existing && existing.id !== id) {
        throw new ConflictError("A blog post with this slug already exists.");
      }
    }

    const post = await this.blogRepository.update(id, {
      title: input.title,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      excerpt: input.excerpt === undefined ? undefined : input.excerpt || null,
      content: input.content === undefined ? undefined : sanitizeRichHtml(input.content),
      featuredImage: input.featuredImage === undefined ? undefined : input.featuredImage || null,
      status: input.status,
      publishedAt: input.publishedAt === undefined ? undefined : input.publishedAt,
      seo: input.seo === undefined ? undefined : input.seo,
      updatedById: actor.id,
    });

    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }

    return post;
  }

  async removeBlog(id: string): Promise<void> {
    const deleted = await this.blogRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Blog post not found.");
    }
  }
}
