import type {
  CreateNavigationItemInput,
  UpdateNavigationItemInput,
} from "@/schemas/navigation/navigation.schema";

import { NotFoundError } from "@/lib/errors";
import {
  NavigationRepository,
  type NavigationItemRecord,
} from "@/repositories/navigation/navigation.repository";

export class NavigationService {
  private readonly navigationRepository: NavigationRepository;

  constructor(navigationRepository = new NavigationRepository()) {
    this.navigationRepository = navigationRepository;
  }

  async listForAdmin(): Promise<NavigationItemRecord[]> {
    return this.navigationRepository.listAll();
  }

  async getById(id: string): Promise<NavigationItemRecord> {
    const item = await this.navigationRepository.findById(id);

    if (!item) {
      throw new NotFoundError("Navigation item not found.");
    }

    return item;
  }

  async create(input: CreateNavigationItemInput): Promise<{ id: string }> {
    await this.assertParentExists(input.parentId);

    return this.navigationRepository.create({
      label: input.label,
      url: input.url,
      position: input.position,
      parentId: input.parentId || null,
      displayOrder: input.displayOrder,
      status: input.status,
    });
  }

  async update(id: string, input: UpdateNavigationItemInput): Promise<NavigationItemRecord> {
    await this.assertParentExists(input.parentId);

    const item = await this.navigationRepository.update(id, {
      label: input.label,
      url: input.url,
      position: input.position,
      parentId: input.parentId === undefined ? undefined : input.parentId || null,
      displayOrder: input.displayOrder,
      status: input.status,
    });

    if (!item) {
      throw new NotFoundError("Navigation item not found.");
    }

    return item;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.navigationRepository.remove(id);

    if (!removed) {
      throw new NotFoundError("Navigation item not found.");
    }
  }

  private async assertParentExists(parentId?: string): Promise<void> {
    if (!parentId) {
      return;
    }

    const parent = await this.navigationRepository.findById(parentId);

    if (!parent) {
      throw new NotFoundError("Parent navigation item not found.");
    }
  }
}
