import type { CreateContactMessageInput } from "@/schemas/contact/contact.schema";

import { NotFoundError } from "@/lib/errors";
import { ContactRepository, type ContactMessageRecord } from "@/repositories/contact";

export class ContactService {
  private readonly contactRepository: ContactRepository;

  constructor(contactRepository = new ContactRepository()) {
    this.contactRepository = contactRepository;
  }

  async create(input: CreateContactMessageInput): Promise<{ id: string }> {
    return this.contactRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      subject: input.subject || null,
      message: input.message,
    });
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.contactRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as ContactMessageRecord["status"] | undefined,
    });
  }

  async getById(id: string): Promise<ContactMessageRecord> {
    const message = await this.contactRepository.findById(id);

    if (!message) {
      throw new NotFoundError("Contact message not found.");
    }

    return message;
  }

  async updateStatus(id: string, status: ContactMessageRecord["status"]): Promise<void> {
    const updated = await this.contactRepository.updateStatus(id, status);

    if (!updated) {
      throw new NotFoundError("Contact message not found.");
    }
  }
}
