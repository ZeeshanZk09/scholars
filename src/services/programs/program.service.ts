import type { CreateProgramInput, UpdateProgramInput } from "@/schemas/program/program.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { slugify } from "@/lib/utils/slug";
import { ProgramRepository, type ProgramAdmin, type ProgramPublic } from "@/repositories/programs";

export class ProgramService {
  private readonly programRepository: ProgramRepository;

  constructor(programRepository = new ProgramRepository()) {
    this.programRepository = programRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<ProgramPublic[]> {
    return this.programRepository.listPublished(options);
  }

  async getPublishedBySlug(slug: string): Promise<ProgramPublic> {
    const program = await this.programRepository.getPublishedBySlug(slug);

    if (!program) {
      throw new NotFoundError("College program not found.");
    }

    return program;
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.programRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as ProgramAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<ProgramAdmin> {
    const program = await this.programRepository.findById(id);

    if (!program) {
      throw new NotFoundError("Program not found.");
    }

    return program;
  }

  async create(input: CreateProgramInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.name);

    await this.assertSlugAvailable(slug);

    return this.programRepository.create({
      name: input.name,
      slug,
      groupName: input.groupName || null,
      description: input.description || null,
      subjects: input.subjects || null,
      eligibility: input.eligibility || null,
      duration: input.duration || null,
      admissionRequirements: input.admissionRequirements || null,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async update(id: string, input: UpdateProgramInput, actor: ApiUser): Promise<ProgramAdmin> {
    if (input.slug) {
      await this.assertSlugAvailable(slugify(input.slug), id);
    }

    const program = await this.programRepository.update(id, {
      ...input,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      updatedById: actor.id,
    });

    if (!program) {
      throw new NotFoundError("Program not found.");
    }

    return program;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.programRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Program not found.");
    }
  }

  private async assertSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.programRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A program with this slug already exists.");
    }
  }
}
