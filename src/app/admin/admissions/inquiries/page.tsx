import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { InquiryStatusButton } from "../../_components/admissions/inquiry-status-button";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-blue-50 text-blue-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

function formatDate(value: Date): string {
  return value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminAdmissionInquiriesPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions/inquiries`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_READ)) {
    redirect("/admin/unauthorized");
  }

  const canUpdate = hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE);
  const { items: inquiries } = await new AdmissionsService().listInquiries({ skip: 0, take: 100 });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/admissions"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Admissions
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Applications submitted from the public admissions form.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Student</th>
              <th className="hidden px-4 py-3 md:table-cell">Contact</th>
              <th className="hidden px-4 py-3 lg:table-cell">Program</th>
              <th className="hidden px-4 py-3 md:table-cell">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No applications yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {inquiry.studentName}
                    {inquiry.parentGuardianName ? (
                      <span className="block text-xs font-normal text-slate-500">
                        Guardian: {inquiry.parentGuardianName}
                      </span>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {inquiry.phone}
                    {inquiry.email ? (
                      <span className="block text-xs">{inquiry.email}</span>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                    {inquiry.interestedProgram ?? inquiry.classOrCourse ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[inquiry.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {canUpdate ? (
                        <InquiryStatusButton id={inquiry.id} current={inquiry.status} />
                      ) : null}
                      <Link
                        href={`/admin/admissions/inquiries/${inquiry.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
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