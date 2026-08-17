import type {
  CreateManagementInput,
  UpdateManagementInput,
} from "@/schemas/management/management.schema";

import { NotFoundError } from "@/lib/errors";
import {
  ManagementRepository,
  type ManagementAdmin,
  type ManagementPublic,
} from "@/repositories/management";

export class ManagementService {
  private readonly managementRepository: ManagementRepository;

  constructor(managementRepository = new ManagementRepository()) {
    this.managementRepository = managementRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<ManagementPublic[]> {
    return this.managementRepository.listPublished(options);
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.managementRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as ManagementAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<ManagementAdmin> {
    const member = await this.managementRepository.findById(id);

    if (!member) {
      throw new NotFoundError("Management member not found.");
    }

    return member;
  }

  async create(input: CreateManagementInput): Promise<{ id: string }> {
    return this.managementRepository.create({
      name: input.name,
      designation: input.designation || null,
      imageUrl: input.imageUrl || null,
      biography: input.biography || null,
      status: input.status,
      displayOrder: input.displayOrder,
    });
  }

  async update(id: string, input: UpdateManagementInput): Promise<ManagementAdmin> {
    const member = await this.managementRepository.update(id, input);

    if (!member) {
      throw new NotFoundError("Management member not found.");
    }

    return member;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.managementRepository.remove(id);

    if (!deleted) {
      throw new NotFoundError("Management member not found.");
    }
  }
}
