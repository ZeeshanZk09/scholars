import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { AdmissionRequirementForm } from "../../../_components/admissions/admission-requirement-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Admission Requirement",
  robots: { index: false, follow: false },
};

export default async function EditAdmissionRequirementPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions/requirements`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  const admissions = new AdmissionsService();
  let requirement;

  try {
    requirement = await admissions.getRequirementById(id);
  } catch {
    notFound();
  }

  const period = await admissions.getPeriodById(requirement.admissionPeriodId);
  const { items: periods } = await admissions.listPeriods({ skip: 0, take: 100 });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/admissions/requirements?periodId=${encodeURIComponent(
            requirement.admissionPeriodId
          )}`}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Requirements
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Requirement</h1>
        <p className="mt-1 text-sm text-slate-600">{period.title}</p>
      </div>

      <AdmissionRequirementForm
        mode="edit"
        periods={periods.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          status: p.status,
        }))}
        initial={{
          id: requirement.id,
          admissionPeriodId: requirement.admissionPeriodId,
          eligibility: requirement.eligibility ?? "",
          requiredDocuments: requirement.requiredDocuments ?? "",
          applicationProcess: requirement.applicationProcess ?? "",
          importantDates: requirement.importantDates ?? "",
          feeInformation: requirement.feeInformation ?? "",
          prospectusUrl: requirement.prospectusUrl ?? "",
          instructions: requirement.instructions ?? "",
          contactInformation: requirement.contactInformation ?? "",
        }}
      />
    </div>
  );
}
