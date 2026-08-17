import type {
  CreateAdmissionInquiryInput,
  CreateAdmissionPeriodInput,
  CreateAdmissionRequirementInput,
  UpdateAdmissionPeriodInput,
  UpdateAdmissionRequirementInput,
} from "@/schemas/admission/admission.schema";
import type { ApiUser } from "@/server/auth/route-guard";

import { ConflictError, NotFoundError } from "@/lib/errors";
import {
  AdmissionsRepository,
  type AdmissionInquiryRecord,
  type AdmissionPeriodRecord,
  type AdmissionRequirementRecord,
} from "@/repositories/admissions";

export class AdmissionsService {
  private readonly admissionsRepository: AdmissionsRepository;

  constructor(admissionsRepository = new AdmissionsRepository()) {
    this.admissionsRepository = admissionsRepository;
  }

  async getCurrentPeriod(category?: string): Promise<AdmissionPeriodRecord> {
    const period = await this.admissionsRepository.findCurrentPeriod({
      category: category as AdmissionPeriodRecord["category"] | undefined,
    });

    if (!period) {
      throw new NotFoundError("No open admission period is available right now.");
    }

    return period;
  }

  async listPeriods(options: { skip: number; take: number; category?: string; status?: string }) {
    return this.admissionsRepository.listPeriods({
      skip: options.skip,
      take: options.take,
      category: options.category as AdmissionPeriodRecord["category"] | undefined,
      status: options.status as AdmissionPeriodRecord["status"] | undefined,
    });
  }

  async getPeriodById(id: string): Promise<AdmissionPeriodRecord> {
    const period = await this.admissionsRepository.findPeriodById(id);

    if (!period) {
      throw new NotFoundError("Admission period not found.");
    }

    return period;
  }

  async listSessions() {
    return this.admissionsRepository.listSessions();
  }

  async createPeriod(input: CreateAdmissionPeriodInput, actor: ApiUser): Promise<{ id: string }> {
    await this.assertPeriodValid(input.sessionId, input.category);

    return this.admissionsRepository.createPeriod({
      sessionId: input.sessionId,
      category: input.category,
      title: input.title,
      description: input.description || null,
      openingDate: toDate(input.openingDate),
      closingDate: toDate(input.closingDate),
      status: input.status,
      isActive: input.isActive,
      createdById: actor.id,
    });
  }

  async updatePeriod(
    id: string,
    input: UpdateAdmissionPeriodInput,
    actor: ApiUser
  ): Promise<AdmissionPeriodRecord> {
    const existing = await this.getPeriodById(id);

    const sessionId = input.sessionId ?? existing.sessionId;
    const category = input.category ?? existing.category;

    await this.assertSessionExists(sessionId);
    await this.assertUniquePeriod(sessionId, category, id);

    const period = await this.admissionsRepository.updatePeriod(id, {
      ...input,
      openingDate: input.openingDate === undefined ? undefined : toDate(input.openingDate),
      closingDate: input.closingDate === undefined ? undefined : toDate(input.closingDate),
      updatedById: actor.id,
    });

    if (!period) {
      throw new NotFoundError("Admission period not found.");
    }

    return period;
  }

  async deletePeriod(id: string): Promise<void> {
    const deleted = await this.admissionsRepository.deletePeriod(id);

    if (!deleted) {
      throw new NotFoundError("Admission period not found.");
    }
  }

  async listRequirements(periodId: string): Promise<AdmissionRequirementRecord[]> {
    return this.admissionsRepository.listRequirements(periodId);
  }

  async getRequirementById(id: string): Promise<AdmissionRequirementRecord> {
    const requirement = await this.admissionsRepository.findRequirementById(id);

    if (!requirement) {
      throw new NotFoundError("Admission requirement not found.");
    }

    return requirement;
  }

  async createRequirement(input: CreateAdmissionRequirementInput): Promise<{ id: string }> {
    await this.getPeriodById(input.admissionPeriodId);

    return this.admissionsRepository.createRequirement({
      admissionPeriodId: input.admissionPeriodId,
      eligibility: input.eligibility || null,
      requiredDocuments: input.requiredDocuments || null,
      applicationProcess: input.applicationProcess || null,
      importantDates: input.importantDates || null,
      feeInformation: input.feeInformation || null,
      prospectusUrl: input.prospectusUrl || null,
      instructions: input.instructions || null,
      contactInformation: input.contactInformation || null,
    });
  }

  async updateRequirement(
    id: string,
    input: UpdateAdmissionRequirementInput
  ): Promise<AdmissionRequirementRecord> {
    const requirement = await this.admissionsRepository.updateRequirement(id, input);

    if (!requirement) {
      throw new NotFoundError("Admission requirement not found.");
    }

    return requirement;
  }

  async deleteRequirement(id: string): Promise<void> {
    const deleted = await this.admissionsRepository.deleteRequirement(id);

    if (!deleted) {
      throw new NotFoundError("Admission requirement not found.");
    }
  }

  async listInquiries(options: { skip: number; take: number; status?: string }) {
    return this.admissionsRepository.listInquiries({
      skip: options.skip,
      take: options.take,
      status: options.status as AdmissionInquiryRecord["status"] | undefined,
    });
  }

  async getInquiryById(id: string): Promise<AdmissionInquiryRecord> {
    const inquiry = await this.admissionsRepository.findInquiryById(id);

    if (!inquiry) {
      throw new NotFoundError("Admission inquiry not found.");
    }

    return inquiry;
  }

  async createInquiry(input: CreateAdmissionInquiryInput): Promise<{ id: string }> {
    const admissionPeriodId = input.admissionPeriodId || null;

    if (admissionPeriodId) {
      const period = await this.admissionsRepository.findPeriodById(admissionPeriodId);

      if (!period) {
        throw new NotFoundError("Admission period not found.");
      }

      if (period.status !== "OPEN") {
        throw new ConflictError("Admissions are not open for this program right now.");
      }
    } else {
      throw new ConflictError("Please select an open admission period to apply.");
    }

    return this.admissionsRepository.createInquiry({
      admissionPeriodId,
      studentName: input.studentName,
      parentGuardianName: input.parentGuardianName || null,
      phone: input.phone,
      email: input.email || null,
      interestedProgram: input.interestedProgram || null,
      classOrCourse: input.classOrCourse || null,
      message: input.message || null,
    });
  }

  async updateInquiryStatus(id: string, status: AdmissionInquiryRecord["status"]): Promise<void> {
    const updated = await this.admissionsRepository.updateInquiryStatus(id, status);

    if (!updated) {
      throw new NotFoundError("Admission inquiry not found.");
    }
  }

  private async assertPeriodValid(sessionId: string, category: string): Promise<void> {
    await this.assertSessionExists(sessionId);
    await this.assertUniquePeriod(sessionId, category);
  }

  private async assertSessionExists(sessionId: string): Promise<void> {
    const session = await this.admissionsRepository.findSessionById(sessionId);

    if (!session) {
      throw new NotFoundError("Academic session not found.");
    }
  }

  private async assertUniquePeriod(
    sessionId: string,
    category: string,
    exceptId?: string
  ): Promise<void> {
    const existing = await this.admissionsRepository.findPeriodBySessionAndCategory(
      sessionId,
      category as AdmissionPeriodRecord["category"]
    );

    if (existing && existing.id !== exceptId) {
      throw new ConflictError("This session already has an admission period for that category.");
    }
  }
}

function toDate(value?: string): Date | null {
  return value ? new Date(value) : null;
}
