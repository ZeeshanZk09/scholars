import { prisma } from "@/server/db";

export type SiteSettingRecord = {
  id: string;
  key: string;
  value: string | null;
  group: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSiteSettingRecord = {
  key: string;
  value: string;
  group: string | null;
  description: string | null;
};

export class SiteSettingRepository {
  async listAll(): Promise<SiteSettingRecord[]> {
    return prisma.siteSetting.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
    }) as unknown as SiteSettingRecord[];
  }

  async findById(id: string): Promise<SiteSettingRecord | null> {
    return prisma.siteSetting.findFirst({ where: { id } }) as unknown as SiteSettingRecord | null;
  }

  async findByKey(key: string): Promise<SiteSettingRecord | null> {
    return prisma.siteSetting.findFirst({ where: { key } }) as unknown as SiteSettingRecord | null;
  }

  async create(record: CreateSiteSettingRecord): Promise<{ id: string }> {
    return prisma.siteSetting.create({
      data: {
        key: record.key,
        value: record.value,
        group: record.group,
        description: record.description,
      },
      select: { id: true },
    });
  }

  async update(
    id: string,
    record: Partial<Omit<CreateSiteSettingRecord, "key">> & { key?: string }
  ): Promise<SiteSettingRecord | null> {
    const result = await prisma.siteSetting.updateMany({
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
      await prisma.siteSetting.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}