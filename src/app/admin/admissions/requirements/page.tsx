import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { DeleteButton } from "../../_components/school/delete-button";
import { PeriodSelect } from "../../_components/admissions/period-select";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Admission Requirements",
  robots: { index: false, follow: false },
};

export default async function AdminAdmissionRequirementsPage({
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

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE);
  const canDelete = hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE);
  const admissions = new AdmissionsService();
  const { periodId } = await searchParams;

  const { items: periods } = await admissions.listPeriods({ skip: 0, take: 100 });
  const selectedPeriod = periods.find((period) => period.id === periodId) ?? periods[0] ?? null;
  const requirements = selectedPeriod ? await admissions.listRequirements(selectedPeriod.id) : [];

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
          <h1 className="text-lg font-semibold text-slate-900">Requirements</h1>
          <p className="mt-1 text-sm text-slate-600">
            Eligibility, required documents, process, dates, fees and instructions per period.
          </p>
        </div>
        {canCreate && selectedPeriod ? (
          <Link
            href={`/admin/admissions/requirements/new?periodId=${selectedPeriod.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Requirement
          </Link>
        ) : null}
      </div>

      <div>
        <label htmlFor="period-filter" className="block text-sm font-medium text-slate-900">
          Admission Period
        </label>
        <PeriodSelect
          value={selectedPeriod?.id ?? ""}
          emptyLabel="No admission periods yet"
          periods={periods.map((period) => ({
            id: period.id,
            label: `${period.title} (${period.category.replace("_", " ")} — ${period.status})`,
          }))}
        />
      </div>

      {selectedPeriod ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Eligibility</th>
                <th className="hidden px-4 py-3 lg:table-cell">Application Process</th>
                <th className="hidden px-4 py-3 md:table-cell">Important Dates</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requirements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No requirements for this period yet.
                  </td>
                </tr>
              ) : (
                requirements.map((requirement) => (
                  <tr key={requirement.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {requirement.eligibility ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                      {requirement.applicationProcess ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                      {requirement.importantDates ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE) ? (
                          <Link
                            href={`/admin/admissions/requirements/${requirement.id}`}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            Edit
                          </Link>
                        ) : (
                          <Pencil className="h-4 w-4 text-slate-300" />
                        )}
                        {canDelete ? (
                          <DeleteButton
                            id={requirement.id}
                            endpoint="/api/v1/admin/admissions/requirements"
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
      ) : (
        <p className="text-sm text-slate-500">
          Create an admission period first, then add its requirements.
        </p>
      )}
    </div>
  );
}
