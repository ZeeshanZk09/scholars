import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const COMPUTER_COURSE_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  shortDescription: true,
  detailedDescription: true,
  duration: true,
  eligibility: true,
  courseOutline: true,
  instructor: true,
  timing: true,
  fee: true,
  admissionStatus: true,
  isFeatured: true,
  displayOrder: true,
} as const;

export const COMPUTER_COURSE_ADMIN_SELECT = {
  ...COMPUTER_COURSE_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ComputerCoursePublic = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  detailedDescription: string | null;
  duration: string | null;
  eligibility: string | null;
  courseOutline: string;
  instructor: string | null;
  timing: string | null;
  fee: string | null;
  admissionStatus: string | null;
  isFeatured: boolean;
  displayOrder: number;
};

export type ComputerCourseAdmin = ComputerCoursePublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateComputerCourseRecord = {
  name: string;
  slug: string;
  shortDescription: string | null;
  detailedDescription: string | null;
  duration: string | null;
  eligibility: string | null;
  courseOutline: string;
  instructor: string | null;
  timing: string | null;
  fee: string | null;
  admissionStatus: string | null;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateComputerCourseRecord = Partial<
  Pick<
    ComputerCourseAdmin,
    | "name"
    | "slug"
    | "shortDescription"
    | "detailedDescription"
    | "duration"
    | "eligibility"
    | "courseOutline"
    | "instructor"
    | "timing"
    | "fee"
    | "admissionStatus"
    | "isFeatured"
    | "status"
    | "displayOrder"
  >
> & { updatedById: string | null };

export class ComputerCourseRepository {
  async listPublished(
    options: { take?: number } = {},
  ): Promise<ComputerCoursePublic[]> {
    const courses = await prisma.computerCourse.findMany({
      select: COMPUTER_COURSE_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return courses as unknown as ComputerCoursePublic[];
  }

  async listAll(options: {
    skip: number;
    take: number;
    status?: ContentStatus;
  }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.computerCourse.findMany({
        select: COMPUTER_COURSE_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.computerCourse.count({ where }),
    ]);

    return { items: items as unknown as ComputerCourseAdmin[], total };
  }

  async findById(id: string): Promise<ComputerCourseAdmin | null> {
    const course = await prisma.computerCourse.findFirst({
      select: COMPUTER_COURSE_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (course as unknown as ComputerCourseAdmin | null) ?? null;
  }

  async findBySlug(slug: string) {
    return prisma.computerCourse.findUnique({
      select: { id: true },
      where: { slug },
    });
  }

  async create(record: CreateComputerCourseRecord): Promise<{ id: string }> {
    return prisma.computerCourse.create({
      data: {
        name: record.name,
        slug: record.slug,
        shortDescription: record.shortDescription,
        detailedDescription: record.detailedDescription,
        duration: record.duration,
        eligibility: record.eligibility,
        courseOutline: record.courseOutline,
        instructor: record.instructor,
        timing: record.timing,
        fee: record.fee,
        admissionStatus: record.admissionStatus,
        isFeatured: record.isFeatured,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(
    id: string,
    record: UpdateComputerCourseRecord,
  ): Promise<ComputerCourseAdmin | null> {
    const result = await prisma.computerCourse.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.computerCourse.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
