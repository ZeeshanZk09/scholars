import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const COACHING_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  category: true,
  description: true,
  targetStudents: true,
  subjects: true,
  duration: true,
  timing: true,
  feeInformation: true,
  admissionStatus: true,
  displayOrder: true,
} as const;

export const COACHING_ADMIN_SELECT = {
  ...COACHING_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type CoachingProgramPublic = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  targetStudents: string | null;
  subjects: string | null;
  duration: string | null;
  timing: string | null;
  feeInformation: string | null;
  admissionStatus: string | null;
  displayOrder: number;
};

export type CoachingProgramAdmin = CoachingProgramPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCoachingProgramRecord = {
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  targetStudents: string | null;
  subjects: string | null;
  duration: string | null;
  timing: string | null;
  feeInformation: string | null;
  admissionStatus: string | null;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateCoachingProgramRecord = Partial<
  Pick<
    CoachingProgramAdmin,
    | "name"
    | "slug"
    | "category"
    | "description"
    | "targetStudents"
    | "subjects"
    | "duration"
    | "timing"
    | "feeInformation"
    | "admissionStatus"
    | "status"
    | "displayOrder"
  >
> & { updatedById: string | null };

export class CoachingProgramRepository {
  async listPublished(options: { take?: number } = {}): Promise<CoachingProgramPublic[]> {
    const programs = await prisma.coachingProgram.findMany({
      select: COACHING_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return programs as unknown as CoachingProgramPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.coachingProgram.findMany({
        select: COACHING_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.coachingProgram.count({ where }),
    ]);

    return { items: items as unknown as CoachingProgramAdmin[], total };
  }

  async findById(id: string): Promise<CoachingProgramAdmin | null> {
    const program = await prisma.coachingProgram.findFirst({
      select: COACHING_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (program as unknown as CoachingProgramAdmin | null) ?? null;
  }

  async findBySlug(slug: string) {
    return prisma.coachingProgram.findUnique({
      select: { id: true },
      where: { slug },
    });
  }

  async getPublishedBySlug(slug: string): Promise<CoachingProgramPublic | null> {
    const program = await prisma.coachingProgram.findFirst({
      where: { slug, deletedAt: null, status: "PUBLISHED" },
      select: COACHING_PUBLIC_SELECT,
    });

    return (program as unknown as CoachingProgramPublic | null) ?? null;
  }

  async create(record: CreateCoachingProgramRecord): Promise<{ id: string }> {
    return prisma.coachingProgram.create({
      data: {
        name: record.name,
        slug: record.slug,
        category: record.category,
        description: record.description,
        targetStudents: record.targetStudents,
        subjects: record.subjects,
        duration: record.duration,
        timing: record.timing,
        feeInformation: record.feeInformation,
        admissionStatus: record.admissionStatus,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(
    id: string,
    record: UpdateCoachingProgramRecord
  ): Promise<CoachingProgramAdmin | null> {
    const result = await prisma.coachingProgram.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.coachingProgram.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
