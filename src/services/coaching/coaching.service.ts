import type {
  CreateCoachingProgramInput,
  UpdateCoachingProgramInput,
} from "@/schemas/coaching/coaching.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { slugify } from "@/lib/utils/slug";
import {
  CoachingProgramRepository,
  type CoachingProgramAdmin,
  type CoachingProgramPublic,
} from "@/repositories/coaching";

export class CoachingProgramService {
  private readonly coachingRepository: CoachingProgramRepository;

  constructor(coachingRepository = new CoachingProgramRepository()) {
    this.coachingRepository = coachingRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<CoachingProgramPublic[]> {
    return this.coachingRepository.listPublished(options);
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.coachingRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as CoachingProgramAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<CoachingProgramAdmin> {
    const program = await this.coachingRepository.findById(id);

    if (!program) {
      throw new NotFoundError("Coaching program not found.");
    }

    return program;
  }

  async create(input: CreateCoachingProgramInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.name);

    await this.assertSlugAvailable(slug);

    return this.coachingRepository.create({
      name: input.name,
      slug,
      category: input.category || null,
      description: input.description || null,
      targetStudents: input.targetStudents || null,
      subjects: input.subjects || null,
      duration: input.duration || null,
      timing: input.timing || null,
      feeInformation: input.feeInformation || null,
      admissionStatus: input.admissionStatus || null,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async update(
    id: string,
    input: UpdateCoachingProgramInput,
    actor: ApiUser
  ): Promise<CoachingProgramAdmin> {
    if (input.slug) {
      await this.assertSlugAvailable(slugify(input.slug), id);
    }

    const program = await this.coachingRepository.update(id, {
      ...input,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      updatedById: actor.id,
    });

    if (!program) {
      throw new NotFoundError("Coaching program not found.");
    }

    return program;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.coachingRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Coaching program not found.");
    }
  }

  private async assertSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.coachingRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A coaching program with this slug already exists.");
    }
  }
}
