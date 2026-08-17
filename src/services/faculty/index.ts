import { type ContentStatus } from "@prisma/client";

import type { CreateFacultyInput, UpdateFacultyInput } from "@/schemas/faculty/faculty.schema";

import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/server/db";

export class FacultyService {
  async list({
    skip = 0,
    take = 20,
    status,
    department,
  }: {
    skip?: number;
    take?: number;
    status?: ContentStatus;
    department?: string;
  } = {}) {
    const where = {
      ...(status && { status }),
      ...(department && { department }),
    };

    const [items, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        skip,
        take,
      }),
      prisma.faculty.count({ where }),
    ]);

    return { items, total };
  }

  async listPublished({
    skip = 0,
    take = 50,
    department,
  }: { skip?: number; take?: number; department?: string } = {}) {
    return this.list({ skip, take, status: "PUBLISHED", department });
  }

  async getById(id: string) {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
    });

    if (!faculty) {
      throw new NotFoundError("Faculty member not found");
    }

    return faculty;
  }

  async create(data: CreateFacultyInput, userId?: string) {
    return prisma.faculty.create({
      data: {
        ...data,
        createdById: userId,
      },
    });
  }

  async update(id: string, data: UpdateFacultyInput, userId?: string) {
    await this.getById(id);

    return prisma.faculty.update({
      where: { id },
      data: {
        ...data,
        updatedById: userId,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return prisma.faculty.delete({
      where: { id },
    });
  }
}
