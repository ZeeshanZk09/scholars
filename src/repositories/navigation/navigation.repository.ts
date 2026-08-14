import type { ContentStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export type NavigationItemRecord = {
  id: string;
  label: string;
  url: string;
  position: string | null;
  parentId: string | null;
  displayOrder: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  parent: { id: string; label: string } | null;
};

export type CreateNavigationItemRecord = {
  label: string;
  url: string;
  position: string;
  parentId: string | null;
  displayOrder: number;
  status: ContentStatus;
};

export class NavigationRepository {
  async listAll(): Promise<NavigationItemRecord[]> {
    return prisma.navigationItem.findMany({
      include: { parent: { select: { id: true, label: true } } },
      orderBy: [{ position: "asc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
    }) as unknown as NavigationItemRecord[];
  }

  async findById(id: string): Promise<NavigationItemRecord | null> {
    return prisma.navigationItem.findFirst({
      where: { id },
      include: { parent: { select: { id: true, label: true } } },
    }) as unknown as NavigationItemRecord | null;
  }

  async create(record: CreateNavigationItemRecord): Promise<{ id: string }> {
    return prisma.navigationItem.create({
      data: {
        label: record.label,
        url: record.url,
        position: record.position,
        parentId: record.parentId,
        displayOrder: record.displayOrder,
        status: record.status,
      },
      select: { id: true },
    });
  }

  async update(
    id: string,
    record: Partial<CreateNavigationItemRecord>
  ): Promise<NavigationItemRecord | null> {
    const result = await prisma.navigationItem.updateMany({
      where: { id },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    try {
      await prisma.navigationItem.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}