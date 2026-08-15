import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { AdmissionRequirementForm } from "../../../_components/admissions/admission-requirement-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "New Admission Requirement",
  robots: { index: false, follow: false },
};

export default async function NewAdmissionRequirementPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ periodId?: string }>;
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

  const { periodId } = await searchParams;
  const { items: periods } = await new AdmissionsService().listPeriods({ skip: 0, take: 100 });
  const preSelected =
    periodId && periods.some((period) => period.id === periodId) ? periodId : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/admissions/requirements?periodId=${encodeURIComponent(preSelected ?? "")}`}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Requirements
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Requirement</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add eligibility, documents, process, dates and instructions for an admission period.
        </p>
      </div>

      {periods.length === 0 ? (
        <p className="text-sm text-slate-500">
          Create an admission period first, then add its requirements.
        </p>
      ) : (
        <AdmissionRequirementForm
          mode="create"
          periods={periods.map((period) => ({
            id: period.id,
            title: period.title,
            category: period.category,
            status: period.status,
          }))}
          initial={preSelected ? { admissionPeriodId: preSelected } : undefined}
        />
      )}
    </div>
  );
}
