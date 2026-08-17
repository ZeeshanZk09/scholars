import type { CreateFacilityInput, UpdateFacilityInput } from "@/schemas/facility/facility.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { slugify } from "@/lib/utils/slug";
import {
  FacilityRepository,
  type FacilityAdmin,
  type FacilityPublic,
} from "@/repositories/facilities";

export class FacilityService {
  private readonly facilityRepository: FacilityRepository;

  constructor(facilityRepository = new FacilityRepository()) {
    this.facilityRepository = facilityRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<FacilityPublic[]> {
    return this.facilityRepository.listPublished(options);
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.facilityRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as FacilityAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<FacilityAdmin> {
    const facility = await this.facilityRepository.findById(id);

    if (!facility) {
      throw new NotFoundError("Facility not found.");
    }

    return facility;
  }

  async create(input: CreateFacilityInput, actor: ApiUser): Promise<{ id: string }> {
    const slug = slugify(input.slug ?? input.name);

    await this.assertSlugAvailable(slug);

    return this.facilityRepository.create({
      name: input.name,
      slug,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      icon: input.icon || null,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async update(id: string, input: UpdateFacilityInput, actor: ApiUser): Promise<FacilityAdmin> {
    if (input.slug) {
      await this.assertSlugAvailable(slugify(input.slug), id);
    }

    const facility = await this.facilityRepository.update(id, {
      ...input,
      slug: input.slug === undefined ? undefined : slugify(input.slug),
      updatedById: actor.id,
    });

    if (!facility) {
      throw new NotFoundError("Facility not found.");
    }

    return facility;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.facilityRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Facility not found.");
    }
  }

  private async assertSlugAvailable(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.facilityRepository.findBySlug(slug);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A facility with this slug already exists.");
    }
  }
}
