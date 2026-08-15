import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { DeleteButton } from "../../_components/school/delete-button";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Admission Periods",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700",
  COMING_SOON: "bg-amber-50 text-amber-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

function formatDate(value: Date | null): string {
  if (!value) {
    return "—";
  }
  return value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminAdmissionPeriodsPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions/periods`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE);
  const canDelete = hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE);
  const { items: periods } = await new AdmissionsService().listPeriods({ skip: 0, take: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/admissions"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admissions
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Admission Periods</h1>
          <p className="mt-1 text-sm text-slate-600">
            Set opening/closing dates and control the admission status shown on the public site.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/admissions/periods/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Period
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Period</th>
              <th className="hidden px-4 py-3 md:table-cell">Category</th>
              <th className="hidden px-4 py-3 lg:table-cell">Dates</th>
              <th className="hidden px-4 py-3 md:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {periods.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No admission periods yet.
                </td>
              </tr>
            ) : (
              periods.map((period) => (
                <tr key={period.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {period.title}
                    <span className="block text-xs font-normal text-slate-500">
                      {period.session.name}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {period.category.replace("_", " ")}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                    {formatDate(period.openingDate)} → {formatDate(period.closingDate)}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[period.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {period.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/admissions/requirements?periodId=${period.id}`}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Requirements
                      </Link>
                      {hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE) ? (
                        <Link
                          href={`/admin/admissions/periods/${period.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Pencil className="h-4 w-4 text-slate-300" />
                      )}
                      {canDelete ? (
                        <DeleteButton
                          id={period.id}
                          endpoint="/api/v1/admin/admissions/periods"
                          label="Delete"
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
