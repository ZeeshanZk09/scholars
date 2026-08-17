import type { AdmissionCategory, AdmissionStatus, InquiryStatus } from "@prisma/client";

import { prisma } from "@/server/db";

const SESSION_LITE_SELECT = {
  id: true,
  name: true,
  slug: true,
} as const;

export type AdmissionSessionLite = {
  id: string;
  name: string;
  slug: string;
};

export type AdmissionPeriodRecord = {
  id: string;
  sessionId: string;
  category: AdmissionCategory;
  title: string;
  description: string | null;
  openingDate: Date | null;
  closingDate: Date | null;
  status: AdmissionStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  session: AdmissionSessionLite;
  requirements: AdmissionRequirementRecord[];
};

export type AdmissionRequirementRecord = {
  id: string;
  admissionPeriodId: string;
  eligibility: string | null;
  requiredDocuments: string | null;
  applicationProcess: string | null;
  importantDates: string | null;
  feeInformation: string | null;
  prospectusUrl: string | null;
  instructions: string | null;
  contactInformation: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdmissionInquiryRecord = {
  id: string;
  admissionPeriodId: string | null;
  studentName: string;
  parentGuardianName: string | null;
  phone: string;
  email: string | null;
  interestedProgram: string | null;
  classOrCourse: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdmissionPeriodRecord = {
  sessionId: string;
  category: AdmissionCategory;
  title: string;
  description: string | null;
  openingDate: Date | null;
  closingDate: Date | null;
  status: AdmissionStatus;
  isActive: boolean;
  createdById: string | null;
};

export type UpdateAdmissionPeriodRecord = Partial<
  Pick<
    AdmissionPeriodRecord,
    | "sessionId"
    | "category"
    | "title"
    | "description"
    | "openingDate"
    | "closingDate"
    | "status"
    | "isActive"
  >
> & { updatedById: string | null };

export type CreateAdmissionRequirementRecord = {
  admissionPeriodId: string;
  eligibility: string | null;
  requiredDocuments: string | null;
  applicationProcess: string | null;
  importantDates: string | null;
  feeInformation: string | null;
  prospectusUrl: string | null;
  instructions: string | null;
  contactInformation: string | null;
};

export type CreateAdmissionInquiryRecord = {
  admissionPeriodId: string | null;
  studentName: string;
  parentGuardianName: string | null;
  phone: string;
  email: string | null;
  interestedProgram: string | null;
  classOrCourse: string | null;
  message: string | null;
};

const REQUIREMENT_SELECT = {
  id: true,
  admissionPeriodId: true,
  eligibility: true,
  requiredDocuments: true,
  applicationProcess: true,
  importantDates: true,
  feeInformation: true,
  prospectusUrl: true,
  instructions: true,
  contactInformation: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AdmissionsRepository {
  async findCurrentPeriod(options: { category?: AdmissionCategory }) {
    const period = await prisma.admissionPeriod.findFirst({
      where: {
        isActive: true,
        status: { in: ["COMING_SOON", "OPEN"] },
        ...(options.category ? { category: options.category } : {}),
      },
      include: {
        session: { select: SESSION_LITE_SELECT },
        requirements: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return period as unknown as AdmissionPeriodRecord | null;
  }

  async listPeriods(options: {
    skip: number;
    take: number;
    category?: AdmissionCategory;
    status?: AdmissionStatus;
  }) {
    const where = {
      ...(options.category ? { category: options.category } : {}),
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.admissionPeriod.findMany({
        include: {
          session: { select: SESSION_LITE_SELECT },
          requirements: { orderBy: { createdAt: "asc" } },
        },
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.admissionPeriod.count({ where }),
    ]);

    return {
      items: items as unknown as AdmissionPeriodRecord[],
      total,
    };
  }

  async findSessionById(sessionId: string) {
    return prisma.academicSession.findFirst({
      where: { id: sessionId },
      select: SESSION_LITE_SELECT,
    });
  }

  async listSessions() {
    return prisma.academicSession.findMany({
      select: SESSION_LITE_SELECT,
      orderBy: { name: "desc" },
    });
  }

  async findPeriodBySessionAndCategory(sessionId: string, category: AdmissionCategory) {
    return prisma.admissionPeriod.findFirst({
      select: { id: true },
      where: { sessionId, category },
    });
  }

  async findPeriodById(id: string): Promise<AdmissionPeriodRecord | null> {
    const period = await prisma.admissionPeriod.findFirst({
      where: { id },
      include: {
        session: { select: SESSION_LITE_SELECT },
        requirements: { orderBy: { createdAt: "asc" } },
      },
    });

    return (period as unknown as AdmissionPeriodRecord | null) ?? null;
  }

  async createPeriod(record: CreateAdmissionPeriodRecord): Promise<{ id: string }> {
    return prisma.admissionPeriod.create({
      data: {
        sessionId: record.sessionId,
        category: record.category,
        title: record.title,
        description: record.description,
        openingDate: record.openingDate,
        closingDate: record.closingDate,
        status: record.status,
        isActive: record.isActive,
        createdById: record.createdById,
      },
      select: { id: true },
    });
  }

  async updatePeriod(
    id: string,
    record: UpdateAdmissionPeriodRecord
  ): Promise<AdmissionPeriodRecord | null> {
    const result = await prisma.admissionPeriod.updateMany({
      where: { id },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findPeriodById(id);
  }

  async deletePeriod(id: string): Promise<boolean> {
    try {
      await prisma.admissionPeriod.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async listRequirements(periodId: string) {
    const requirements = await prisma.admissionRequirement.findMany({
      select: REQUIREMENT_SELECT,
      where: { admissionPeriodId: periodId },
      orderBy: { createdAt: "asc" },
    });

    return requirements as unknown as AdmissionRequirementRecord[];
  }

  async findRequirementById(id: string): Promise<AdmissionRequirementRecord | null> {
    const requirement = await prisma.admissionRequirement.findFirst({
      select: REQUIREMENT_SELECT,
      where: { id },
    });

    return (requirement as unknown as AdmissionRequirementRecord | null) ?? null;
  }

  async createRequirement(record: CreateAdmissionRequirementRecord): Promise<{ id: string }> {
    return prisma.admissionRequirement.create({
      data: {
        admissionPeriodId: record.admissionPeriodId,
        eligibility: record.eligibility,
        requiredDocuments: record.requiredDocuments,
        applicationProcess: record.applicationProcess,
        importantDates: record.importantDates,
        feeInformation: record.feeInformation,
        prospectusUrl: record.prospectusUrl,
        instructions: record.instructions,
        contactInformation: record.contactInformation,
      },
      select: { id: true },
    });
  }

  async updateRequirement(
    id: string,
    record: Partial<Omit<CreateAdmissionRequirementRecord, "admissionPeriodId">>
  ): Promise<AdmissionRequirementRecord | null> {
    const result = await prisma.admissionRequirement.updateMany({
      where: { id },
      data: record,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findRequirementById(id);
  }

  async deleteRequirement(id: string): Promise<boolean> {
    try {
      await prisma.admissionRequirement.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async listInquiries(options: { skip: number; take: number; status?: InquiryStatus }) {
    const where = options.status ? { status: options.status } : {};

    const [items, total] = await Promise.all([
      prisma.admissionInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: options.skip,
        take: options.take,
      }),
      prisma.admissionInquiry.count({ where }),
    ]);

    return {
      items: items as unknown as AdmissionInquiryRecord[],
      total,
    };
  }

  async findInquiryById(id: string): Promise<AdmissionInquiryRecord | null> {
    const inquiry = await prisma.admissionInquiry.findFirst({
      where: { id },
    });

    return (inquiry as unknown as AdmissionInquiryRecord | null) ?? null;
  }

  async createInquiry(record: CreateAdmissionInquiryRecord): Promise<{ id: string }> {
    return prisma.admissionInquiry.create({
      data: {
        admissionPeriodId: record.admissionPeriodId,
        studentName: record.studentName,
        parentGuardianName: record.parentGuardianName,
        phone: record.phone,
        email: record.email,
        interestedProgram: record.interestedProgram,
        classOrCourse: record.classOrCourse,
        message: record.message,
      },
      select: { id: true },
    });
  }

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<boolean> {
    const result = await prisma.admissionInquiry.updateMany({
      where: { id },
      data: { status },
    });

    return result.count > 0;
  }
}
