import type { ContentStatus, TestimonialType } from "@prisma/client";

import { prisma } from "@/server/db";

export const TESTIMONIAL_PUBLIC_SELECT = {
  id: true,
  name: true,
  role: true,
  type: true,
  message: true,
  imageUrl: true,
  rating: true,
  displayOrder: true,
} as const;

export const TESTIMONIAL_ADMIN_SELECT = {
  ...TESTIMONIAL_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type TestimonialPublic = {
  id: string;
  name: string;
  role: string | null;
  type: TestimonialType;
  message: string;
  imageUrl: string | null;
  rating: number;
  displayOrder: number;
};

export type TestimonialAdmin = TestimonialPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTestimonialRecord = {
  name: string;
  role: string | null;
  type: TestimonialType;
  message: string;
  imageUrl: string | null;
  rating: number;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateTestimonialRecord = Partial<
  Pick<
    TestimonialAdmin,
    "name" | "role" | "type" | "message" | "imageUrl" | "rating" | "status" | "displayOrder"
  >
> & { updatedById: string | null };

export class TestimonialRepository {
  async listPublished(options: { take?: number } = {}): Promise<TestimonialPublic[]> {
    const testimonials = await prisma.testimonial.findMany({
      select: TESTIMONIAL_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return testimonials as unknown as TestimonialPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.testimonial.findMany({
        select: TESTIMONIAL_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return { items: items as unknown as TestimonialAdmin[], total };
  }

  async findById(id: string): Promise<TestimonialAdmin | null> {
    const testimonial = await prisma.testimonial.findFirst({
      select: TESTIMONIAL_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (testimonial as unknown as TestimonialAdmin | null) ?? null;
  }

  async create(record: CreateTestimonialRecord): Promise<{ id: string }> {
    return prisma.testimonial.create({
      data: {
        name: record.name,
        role: record.role,
        type: record.type,
        message: record.message,
        imageUrl: record.imageUrl,
        rating: record.rating,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateTestimonialRecord): Promise<TestimonialAdmin | null> {
    const result = await prisma.testimonial.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.testimonial.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
