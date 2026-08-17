import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const PROGRAM_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  groupName: true,
  description: true,
  subjects: true,
  eligibility: true,
  duration: true,
  admissionRequirements: true,
  displayOrder: true,
} as const;

export const PROGRAM_ADMIN_SELECT = {
  ...PROGRAM_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ProgramPublic = {
  id: string;
  name: string;
  slug: string;
  groupName: string | null;
  description: string | null;
  subjects: string | null;
  eligibility: string | null;
  duration: string | null;
  admissionRequirements: string | null;
  displayOrder: number;
};

export type ProgramAdmin = ProgramPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProgramRecord = {
  name: string;
  slug: string;
  groupName: string | null;
  description: string | null;
  subjects: string | null;
  eligibility: string | null;
  duration: string | null;
  admissionRequirements: string | null;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateProgramRecord = Partial<
  Pick<
    ProgramAdmin,
    | "name"
    | "slug"
    | "groupName"
    | "description"
    | "subjects"
    | "eligibility"
    | "duration"
    | "admissionRequirements"
    | "status"
    | "displayOrder"
  >
> & { updatedById: string | null };

export class ProgramRepository {
  async listPublished(options: { take?: number } = {}): Promise<ProgramPublic[]> {
    const programs = await prisma.collegeProgram.findMany({
      select: PROGRAM_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      ...(options.take ? { take: options.take } : {}),
    });

    return programs as unknown as ProgramPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.collegeProgram.findMany({
        select: PROGRAM_ADMIN_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.collegeProgram.count({ where }),
    ]);

    return { items: items as unknown as ProgramAdmin[], total };
  }

  async findById(id: string): Promise<ProgramAdmin | null> {
    const program = await prisma.collegeProgram.findFirst({
      select: PROGRAM_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (program as unknown as ProgramAdmin | null) ?? null;
  }

  async findBySlug(slug: string) {
    return prisma.collegeProgram.findUnique({
      select: { id: true },
      where: { slug },
    });
  }

  async getPublishedBySlug(slug: string): Promise<ProgramPublic | null> {
    const program = await prisma.collegeProgram.findFirst({
      where: { slug, deletedAt: null, status: "PUBLISHED" },
      select: PROGRAM_PUBLIC_SELECT,
    });

    return (program as unknown as ProgramPublic | null) ?? null;
  }

  async create(record: CreateProgramRecord): Promise<{ id: string }> {
    return prisma.collegeProgram.create({
      data: {
        name: record.name,
        slug: record.slug,
        groupName: record.groupName,
        description: record.description,
        subjects: record.subjects,
        eligibility: record.eligibility,
        duration: record.duration,
        admissionRequirements: record.admissionRequirements,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateProgramRecord): Promise<ProgramAdmin | null> {
    const result = await prisma.collegeProgram.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.collegeProgram.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
