import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";
import type { SchoolClassPublic } from "./school-class.repository";
import { SCHOOL_CLASS_PUBLIC_SELECT } from "./school-class.repository";

export const ACADEMIC_LEVEL_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  displayOrder: true,
} as const;

export const ACADEMIC_LEVEL_ADMIN_SELECT = {
  ...ACADEMIC_LEVEL_PUBLIC_SELECT,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type AcademicLevelPublic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
};

export type AcademicLevelAdmin = AcademicLevelPublic & {
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAcademicLevelRecord = {
  name: string;
  slug: string;
  description: string | null;
  status: ContentStatus;
  displayOrder: number;
  createdById: string | null;
};

export type UpdateAcademicLevelRecord = Partial<
  Pick<AcademicLevelAdmin, "name" | "slug" | "description" | "status" | "displayOrder">
> & { updatedById: string | null };

export class AcademicLevelRepository {
  async listPublished() {
    const levels = await prisma.academicLevel.findMany({
      select: ACADEMIC_LEVEL_PUBLIC_SELECT,
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return levels as unknown as AcademicLevelPublic[];
  }

  async listPublishedWithClasses() {
    const levels = await prisma.academicLevel.findMany({
      select: {
        ...ACADEMIC_LEVEL_PUBLIC_SELECT,
        classes: {
          select: SCHOOL_CLASS_PUBLIC_SELECT,
          where: { deletedAt: null, status: "PUBLISHED" },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        },
      },
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return levels as unknown as Array<
      AcademicLevelPublic & { classes: SchoolClassPublic[] }
    >;
  }

  async listAll(options: { skip: number; take: number; status?: ContentStatus }) {
    const where = {
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.academicLevel.findMany({
        select: ACADEMIC_LEVEL_ADMIN_SELECT,
        where,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        skip: options.skip,
        take: options.take,
      }),
      prisma.academicLevel.count({ where }),
    ]);

    return { items: items as unknown as AcademicLevelAdmin[], total };
  }

  async findById(id: string): Promise<AcademicLevelAdmin | null> {
    const level = await prisma.academicLevel.findFirst({
      select: ACADEMIC_LEVEL_ADMIN_SELECT,
      where: { id, deletedAt: null },
    });

    return (level as unknown as AcademicLevelAdmin | null) ?? null;
  }

  async findBySlug(slug: string) {
    return prisma.academicLevel.findUnique({
      select: { id: true },
      where: { slug },
    });
  }

  async create(record: CreateAcademicLevelRecord): Promise<{ id: string }> {
    return prisma.academicLevel.create({
      data: {
        name: record.name,
        slug: record.slug,
        description: record.description,
        status: record.status,
        displayOrder: record.displayOrder,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async update(
    id: string,
    record: UpdateAcademicLevelRecord
  ): Promise<AcademicLevelAdmin | null> {
    const result = await prisma.academicLevel.updateMany({
      where: { id, deletedAt: null },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await prisma.academicLevel.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }
}
