import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { AdmissionPeriodForm } from "../../../_components/admissions/admission-period-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const metadata: Metadata = {
  title: "New Admission Period",
  robots: { index: false, follow: false },
};

export default async function NewAdmissionPeriodPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions/periods`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE)) {
    redirect("/admin/unauthorized");
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
          New Admission Period
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create an admission period and set its status for the public website.
        </p>
      </div>

      <AdmissionPeriodForm mode="create" sessions={sessions} />
    </div>
  );
}
