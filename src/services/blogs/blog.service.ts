import type { CreateBlogInput, UpdateBlogInput } from "@/schemas/blog/blog.schema";
import type {
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from "@/schemas/blog/category.schema";
import type { CreateBlogTagInput, UpdateBlogTagInput } from "@/schemas/blog/tag.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { sanitizeRichHtml } from "@/lib/security/sanitize-html";
import { slugify } from "@/lib/utils/slug";
import { BlogRepository, type BlogPublicDetail, type BlogSafe } from "@/repositories/blogs";

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

  async listTags() {
    return this.blogRepository.listTags();
  }

  async listAllCategories() {
    return this.blogRepository.listAllCategories();
  }

  async listAllTags() {
    return this.blogRepository.listAllTags();
  }

  async createCategory(input: CreateBlogCategoryInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.name);

    const existing = await this.blogRepository.findCategoryBySlug(slug);
    if (existing) {
      throw new ConflictError("A category with this name already exists.");
    }

    return this.blogRepository.createCategory({
      name: input.name,
      slug,
      description: input.description || null,
      status: input.status,
      createdById: actor.id,
    });
  }

  async updateCategory(id: string, input: UpdateBlogCategoryInput): Promise<void> {
    const updated = await this.blogRepository.updateCategory(id, input);

    if (!updated) {
      throw new NotFoundError("Blog category not found.");
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const deleted = await this.blogRepository.deleteCategory(id);

    if (!deleted) {
      throw new NotFoundError("Blog category not found.");
    }
  }

  async createTag(input: CreateBlogTagInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.name);

    const existing = await this.blogRepository.findTagBySlug(slug);
    if (existing) {
      throw new ConflictError("A tag with this name already exists.");
    }

    return this.blogRepository.createTag({
      name: input.name,
      slug,
      createdById: actor.id,
    });
  }

  async updateTag(id: string, input: UpdateBlogTagInput): Promise<void> {
    const existing = await this.blogRepository.findTagById(id);
    if (!existing) {
      throw new NotFoundError("Blog tag not found.");
    }

    const updated = await this.blogRepository.updateTag(id, input.name);
    if (!updated) {
      throw new NotFoundError("Blog tag not found.");
    }
  }

  async deleteTag(id: string): Promise<void> {
    const deleted = await this.blogRepository.deleteTag(id);

    if (!deleted) {
      throw new NotFoundError("Blog tag not found.");
    }
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
      tagIds: input.tags,
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
      tagIds: input.tags,
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
