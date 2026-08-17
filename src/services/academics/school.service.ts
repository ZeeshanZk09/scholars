import type {
  CreateAcademicLevelInput,
  CreateSchoolClassInput,
  UpdateAcademicLevelInput,
  UpdateSchoolClassInput,
} from "@/schemas/academics/school.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { slugify } from "@/lib/utils/slug";
import {
  AcademicLevelRepository,
  SchoolClassRepository,
  type AcademicLevelAdmin,
  type SchoolClassAdmin,
} from "@/repositories/academics";

export class SchoolService {
  private readonly levelRepository: AcademicLevelRepository;
  private readonly classRepository: SchoolClassRepository;

  constructor(
    levelRepository = new AcademicLevelRepository(),
    classRepository = new SchoolClassRepository()
  ) {
    this.levelRepository = levelRepository;
    this.classRepository = classRepository;
  }

  async listLevelsPublished() {
    return this.levelRepository.listPublishedWithClasses();
  }

  async listClassesPublished() {
    return this.classRepository.listPublished();
  }

  async listLevelsForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.levelRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as AcademicLevelAdmin["status"] | undefined,
    });
  }

  async listClassesForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.classRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as SchoolClassAdmin["status"] | undefined,
    });
  }

  async getLevelById(id: string): Promise<AcademicLevelAdmin> {
    const level = await this.levelRepository.findById(id);

    if (!level) {
      throw new NotFoundError("Academic level not found.");
    }

    return level;
  }

  async getClassById(id: string): Promise<SchoolClassAdmin> {
    const schoolClass = await this.classRepository.findById(id);

    if (!schoolClass) {
      throw new NotFoundError("School class not found.");
    }

    return schoolClass;
  }

  async createLevel(input: CreateAcademicLevelInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.name);

    await this.assertLevelSlugAvailable(slug);

    return this.levelRepository.create({
      name: input.name,
      slug,
      description: input.description || null,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async updateLevel(
    id: string,
    input: UpdateAcademicLevelInput,
    actor: ApiUser
  ): Promise<AcademicLevelAdmin> {
    if (input.slug) {
      await this.assertLevelSlugAvailable(slugify(input.slug), id);
    }

    const level = await this.levelRepository.update(id, {
      ...input,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      updatedById: actor.id,
    });

    if (!level) {
      throw new NotFoundError("Academic level not found.");
    }

    return level;
  }

  async removeLevel(id: string): Promise<void> {
    const deleted = await this.levelRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Academic level not found.");
    }
  }

  async createClass(input: CreateSchoolClassInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.name);

    await this.assertClassSlugAvailable(slug);

    return this.classRepository.create({
      name: input.name,
      slug,
      description: input.description || null,
      eligibility: input.eligibility || null,
      learningOutcomes: input.learningOutcomes || null,
      levelId: input.levelId,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async updateClass(
    id: string,
    input: UpdateSchoolClassInput,
    actor: ApiUser
  ): Promise<SchoolClassAdmin> {
    if (input.slug) {
      await this.assertClassSlugAvailable(slugify(input.slug), id);
    }

    const schoolClass = await this.classRepository.update(id, {
      ...input,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      updatedById: actor.id,
    });

    if (!schoolClass) {
      throw new NotFoundError("School class not found.");
    }

    return schoolClass;
  }

  async removeClass(id: string): Promise<void> {
    const deleted = await this.classRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("School class not found.");
    }
  }

  private async assertLevelSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.levelRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("An academic level with this slug already exists.");
    }
  }

  private async assertClassSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.classRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A school class with this slug already exists.");
    }
  }
}
