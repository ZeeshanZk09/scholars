import type {
  CreateComputerCourseInput,
  UpdateComputerCourseInput,
} from "@/schemas/computer-course/computer-course.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { slugify } from "@/lib/utils/slug";
import {
  ComputerCourseRepository,
  type ComputerCourseAdmin,
  type ComputerCoursePublic,
} from "@/repositories/computer-courses";

export class ComputerCourseService {
  private readonly computerCourseRepository: ComputerCourseRepository;

  constructor(computerCourseRepository = new ComputerCourseRepository()) {
    this.computerCourseRepository = computerCourseRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<ComputerCoursePublic[]> {
    return this.computerCourseRepository.listPublished(options);
  }

  async getPublishedBySlug(slug: string): Promise<ComputerCoursePublic> {
    const course = await this.computerCourseRepository.getPublishedBySlug(slug);

    if (!course) {
      throw new NotFoundError("Computer course not found.");
    }

    return course;
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.computerCourseRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as ComputerCourseAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<ComputerCourseAdmin> {
    const course = await this.computerCourseRepository.findById(id);

    if (!course) {
      throw new NotFoundError("Computer course not found.");
    }

    return course;
  }

  async create(input: CreateComputerCourseInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.name);

    await this.assertSlugAvailable(slug);

    return this.computerCourseRepository.create({
      name: input.name,
      slug,
      shortDescription: input.shortDescription || null,
      detailedDescription: input.detailedDescription || null,
      duration: input.duration || null,
      eligibility: input.eligibility || null,
      courseOutline: input.courseOutline,
      instructor: input.instructor || null,
      timing: input.timing || null,
      fee: input.fee || null,
      admissionStatus: input.admissionStatus || null,
      isFeatured: input.isFeatured,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async update(
    id: string,
    input: UpdateComputerCourseInput,
    actor: ApiUser
  ): Promise<ComputerCourseAdmin> {
    if (input.slug) {
      await this.assertSlugAvailable(slugify(input.slug), id);
    }

    const course = await this.computerCourseRepository.update(id, {
      ...input,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      updatedById: actor.id,
    });

    if (!course) {
      throw new NotFoundError("Computer course not found.");
    }

    return course;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.computerCourseRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Computer course not found.");
    }
  }

  private async assertSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.computerCourseRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A computer course with this slug already exists.");
    }
  }
}
