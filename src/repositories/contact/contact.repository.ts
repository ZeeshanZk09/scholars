import type { ContactMessageStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export const CONTACT_MESSAGE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactMessageRecord = {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
};

export class ContactRepository {
  async create(record: CreateContactMessageRecord): Promise<{ id: string }> {
    return prisma.contactMessage.create({
      data: {
        name: record.name,
        email: record.email,
        phone: record.phone,
        subject: record.subject,
        message: record.message,
      },
      select: { id: true },
    });
  }

  async listAll(options: { skip: number; take: number; status?: ContactMessageStatus }) {
    const where = options.status ? { status: options.status } : {};

    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        select: CONTACT_MESSAGE_SELECT,
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      items: items as unknown as ContactMessageRecord[],
      total,
    };
  }

  async findById(id: string): Promise<ContactMessageRecord | null> {
    const message = await prisma.contactMessage.findFirst({
      select: CONTACT_MESSAGE_SELECT,
      where: { id },
    });

    return (message as unknown as ContactMessageRecord | null) ?? null;
  }

  async updateStatus(id: string, status: ContactMessageStatus): Promise<boolean> {
    const result = await prisma.contactMessage.updateMany({
      where: { id },
      data: { status },
    });

    return result.count > 0;
  }
}
