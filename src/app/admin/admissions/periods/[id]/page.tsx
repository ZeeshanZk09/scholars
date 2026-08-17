import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { type User } from "next-auth";

import { AdmissionPeriodForm } from "../../../_components/admissions/admission-period-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const metadata: Metadata = {
  title: "Edit Admission Period",
  robots: { index: false, follow: false },
};

export default async function EditAdmissionPeriodPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions/periods`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let period;

  try {
    period = await new AdmissionsService().getPeriodById(id);
  } catch {
    notFound();
  }

  const sessions = await new AdmissionsService().listSessions();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/admissions/periods"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Admission Periods
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">
          Edit Admission Period
        </h1>
        <p className="mt-1 text-sm text-slate-600">{period.title}</p>
      </div>

      <AdmissionPeriodForm
        mode="edit"
        sessions={sessions}
        initial={{
          id: period.id,
          sessionId: period.sessionId,
          category: period.category,
          title: period.title,
          description: period.description ?? "",
          openingDate: period.openingDate
            ? period.openingDate.toISOString()
            : "",
          closingDate: period.closingDate
            ? period.closingDate.toISOString()
            : "",
          status: period.status,
          isActive: period.isActive,
        }}
      />
    </div>
  );
}
