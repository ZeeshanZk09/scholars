import bcrypt from "bcryptjs";

import { AuthorizationError, ConflictError, NotFoundError } from "@/lib/errors";
import { UserRepository, type UserSafe } from "@/repositories/users";
import type { ApiUser } from "@/server/auth/route-guard";
import type { CreateUserInput } from "@/schemas/user/user.schema";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async listUsers(): Promise<UserSafe[]> {
    return this.userRepository.listAllSafe();
  }

  async listForAdmin(options: { skip: number; take: number }) {
    return this.userRepository.listAll(options);
  }

  async getById(id: string): Promise<UserSafe> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }

  async createUser(input: CreateUserInput): Promise<{ id: string }> {
    await this.assertEmailAvailable(input.email);

    const passwordHash = await bcrypt.hash(input.password, 12);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      status: input.status,
    });
  }

  async updateUser(
    id: string,
    input: {
      name?: string;
      email?: string;
      password?: string;
      role?: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
      status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    },
    actor?: ApiUser,
  ): Promise<UserSafe> {
    const target = await this.getById(id);

    if (actor && actor.id === id) {
      throw new AuthorizationError("You cannot update your own account through this endpoint.");
    }

    if (input.email) {
      await this.assertEmailAvailable(input.email, id);
    }

    if (target.role === "SUPER_ADMIN" && input.role && input.role !== "SUPER_ADMIN") {
      await this.assertSuperAdminRemains();
    }

    if (target.role === "SUPER_ADMIN" && input.status && input.status !== "ACTIVE") {
      await this.assertSuperAdminRemains();
    }

    const user = await this.userRepository.update(id, {
      name: input.name,
      email: input.email,
      passwordHash: input.password ? await bcrypt.hash(input.password, 12) : undefined,
      role: input.role,
      status: input.status,
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }

  async removeUser(id: string, actor?: ApiUser): Promise<void> {
    const target = await this.getById(id);

    if (actor && actor.id === id) {
      throw new AuthorizationError("You cannot delete your own account.");
    }

    if (target.role === "SUPER_ADMIN") {
      await this.assertSuperAdminRemains();
    }

    const deleted = await this.userRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("User not found.");
    }
  }

  private async assertSuperAdminRemains(): Promise<void> {
    const count = await this.userRepository.countActiveSuperAdmins();

    if (count <= 1) {
      throw new AuthorizationError(
        "At least one active super admin must remain.",
      );
    }
  }

  private async assertEmailAvailable(email: string, exceptId?: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("A user with this email already exists.");
    }
  }
}
