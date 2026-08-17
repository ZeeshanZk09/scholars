import type {
  CreatePrincipalInput,
  UpdatePrincipalInput,
} from "@/schemas/principal/principal.schema";

import { NotFoundError } from "@/lib/errors";
import {
  PrincipalRepository,
  type PrincipalAdmin,
  type PrincipalPublic,
} from "@/repositories/principal";

export class PrincipalService {
  private readonly principalRepository: PrincipalRepository;

  constructor(principalRepository = new PrincipalRepository()) {
    this.principalRepository = principalRepository;
  }

  async listPublished(options: { take?: number } = {}): Promise<PrincipalPublic[]> {
    return this.principalRepository.listPublished(options);
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.principalRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as PrincipalAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<PrincipalAdmin> {
    const message = await this.principalRepository.findById(id);

    if (!message) {
      throw new NotFoundError("Principal message not found.");
    }

    return message;
  }

  async create(input: CreatePrincipalInput): Promise<{ id: string }> {
    return this.principalRepository.create({
      name: input.name,
      designation: input.designation || null,
      profileImageUrl: input.profileImageUrl || null,
      message: input.message,
      biography: input.biography || null,
      status: input.status,
      displayOrder: input.displayOrder,
    });
  }

  async update(id: string, input: UpdatePrincipalInput): Promise<PrincipalAdmin> {
    const message = await this.principalRepository.update(id, input);

    if (!message) {
      throw new NotFoundError("Principal message not found.");
    }

    return message;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.principalRepository.remove(id);

    if (!deleted) {
      throw new NotFoundError("Principal message not found.");
    }
  }
}
