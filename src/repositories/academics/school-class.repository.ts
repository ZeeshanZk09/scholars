import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const SCHOOL_CLASS_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  eligibility: true,
  learningOutcomes: true,
  levelId: true,
  displayOrder: true,
} as const;

export const SCHOOL_CLASS_ADMIN_SELECT = {
  ...SCHOOL_CLASS_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type SchoolClassPublic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  eligibility: string | null;
  learningOutcomes: string | null;
  levelId: string;
  displayOrder: number;
};

export type SchoolClassAdmin = SchoolClassPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSchoolClassRecord = {
  name: string;
  slug: string;
  description: string | null;
  eligibility: string | null;
  learningOutcomes: string | null;
  levelId: string;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateSchoolClassRecord = Partial<
  Pick<
    SchoolClassAdmin,
    | "name"
    | "slug"
    | "description"
    | "eligibility"
    | "learningOutcomes"
    | "levelId"
    | "status"
    | "displayOrder"
  >
> & { updatedById: string | null };

export class SchoolClassRepository {
  async listPublished() {
    const classes = await prisma.schoolClass.findMany({
      select: SCHOOL_CLASS_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return classes as unknown as SchoolClassPublic[];
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.schoolClass.findMany({
        select: SCHOOL_CLASS_ADMIN_SELECT,
        where,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        skip: options.skip,
        take: options.take,
      }),
      prisma.schoolClass.count({ where }),
    ]);

    return { items: items as unknown as SchoolClassAdmin[], total };
  }

  async findById(id: string): Promise<SchoolClassAdmin | null> {
    const schoolClass = await prisma.schoolClass.findFirst({
      select: SCHOOL_CLASS_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (schoolClass as unknown as SchoolClassAdmin | null) ?? null;
  }

  async findBySlug(slug: string) {
    return prisma.schoolClass.findUnique({
      select: { id: true },
      where: { slug },
    });
  }

  async getPublishedBySlug(slug: string): Promise<SchoolClassPublic | null> {
    const schoolClass = await prisma.schoolClass.findFirst({
      where: { slug, deletedAt: null, status: "PUBLISHED" },
      select: SCHOOL_CLASS_PUBLIC_SELECT,
    });

    return (schoolClass as unknown as SchoolClassPublic | null) ?? null;
  }

  async create(record: CreateSchoolClassRecord): Promise<{ id: string }> {
    return prisma.schoolClass.create({
      data: {
        name: record.name,
        slug: record.slug,
        description: record.description,
        eligibility: record.eligibility,
        learningOutcomes: record.learningOutcomes,
        levelId: record.levelId,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(id: string, record: UpdateSchoolClassRecord): Promise<SchoolClassAdmin | null> {
    const result = await prisma.schoolClass.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.schoolClass.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
