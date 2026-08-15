import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { InquiryStatusButton } from "../../../_components/admissions/inquiry-status-button";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Application Details",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-blue-50 text-blue-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

function formatDate(value: Date): string {
  return value.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminAdmissionInquiryDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions/inquiries`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_READ)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let inquiry;

  try {
    inquiry = await new AdmissionsService().getInquiryById(id);
  } catch {
    notFound();
  }

  const rows = [
    { label: "Student Name", value: inquiry.studentName },
    { label: "Parent / Guardian", value: inquiry.parentGuardianName },
    { label: "Phone", value: inquiry.phone },
    { label: "Email", value: inquiry.email },
    { label: "Interested Program", value: inquiry.interestedProgram },
    { label: "Class / Course", value: inquiry.classOrCourse },
    { label: "Message", value: inquiry.message },
    { label: "Submitted", value: formatDate(inquiry.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/admissions/inquiries"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Applications
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Application Details</h1>
          <p className="mt-1 text-sm text-slate-600">Submitted by {inquiry.studentName}</p>
        </div>
        {hasPermission(user.role, PERMISSIONS.ADMISSION_MANAGE) ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Status:</span>
            <InquiryStatusButton id={inquiry.id} current={inquiry.status} />
          </div>
        ) : (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              STATUS_STYLES[inquiry.status] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {inquiry.status}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {row.label}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-900">{row.value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
