import type {
  CreateSiteSettingInput,
  UpdateSiteSettingInput,
} from "@/schemas/settings/site-setting.schema";

import { ConflictError, NotFoundError } from "@/lib/errors";
import {
  SiteSettingRepository,
  type SiteSettingRecord,
} from "@/repositories/settings/site-setting.repository";

export class SiteSettingService {
  private readonly siteSettingRepository: SiteSettingRepository;

  constructor(siteSettingRepository = new SiteSettingRepository()) {
    this.siteSettingRepository = siteSettingRepository;
  }

  async listForAdmin(): Promise<SiteSettingRecord[]> {
    return this.siteSettingRepository.listAll();
  }

  async getById(id: string): Promise<SiteSettingRecord> {
    const setting = await this.siteSettingRepository.findById(id);

    if (!setting) {
      throw new NotFoundError("Site setting not found.");
    }

    return setting;
  }

  async create(input: CreateSiteSettingInput): Promise<{ id: string }> {
    await this.assertKeyAvailable(input.key);

    return this.siteSettingRepository.create({
      key: input.key,
      value: input.value,
      group: input.group || null,
      description: input.description || null,
    });
  }

  async update(id: string, input: UpdateSiteSettingInput): Promise<SiteSettingRecord> {
    if (input.key) {
      await this.assertKeyAvailable(input.key, id);
    }

    const setting = await this.siteSettingRepository.update(id, {
      key: input.key,
      value: input.value,
      group: input.group === undefined ? undefined : input.group || null,
      description: input.description === undefined ? undefined : input.description || null,
    });

    if (!setting) {
      throw new NotFoundError("Site setting not found.");
    }

    return setting;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.siteSettingRepository.remove(id);

    if (!removed) {
      throw new NotFoundError("Site setting not found.");
    }
  }

  private async assertKeyAvailable(key: string, exceptId?: string): Promise<void> {
    const existing = await this.siteSettingRepository.findByKey(key);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A site setting with this key already exists.");
    }
  }
}
