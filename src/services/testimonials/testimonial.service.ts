import { NotFoundError } from "@/lib/errors";
import {
  TestimonialRepository,
  type TestimonialAdmin,
  type TestimonialPublic,
} from "@/repositories/testimonials";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "@/schemas/testimonial/testimonial.schema";
import type { ApiUser } from "@/server/auth/route-guard";

export class TestimonialService {
  private readonly testimonialRepository: TestimonialRepository;

  constructor(testimonialRepository = new TestimonialRepository()) {
    this.testimonialRepository = testimonialRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<TestimonialPublic[]> {
    return this.testimonialRepository.listPublished(options);
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.testimonialRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as TestimonialAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<TestimonialAdmin> {
    const testimonial = await this.testimonialRepository.findById(id);

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found.");
    }

    return testimonial;
  }

  async create(input: CreateTestimonialInput, actor: ApiUser): Promise<{ id: string }> {
    return this.testimonialRepository.create({
      name: input.name,
      role: input.role || null,
      type: input.type,
      message: input.message,
      imageUrl: input.imageUrl || null,
      rating: input.rating,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async update(
    id: string,
    input: UpdateTestimonialInput,
    actor: ApiUser
  ): Promise<TestimonialAdmin> {
    const testimonial = await this.testimonialRepository.update(id, {
      ...input,
      updatedById: actor.id,
    });

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found.");
    }

    return testimonial;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.testimonialRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Testimonial not found.");
    }
  }
}
