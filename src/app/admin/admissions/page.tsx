import {
  CalendarClock,
  ClipboardList,
  GraduationCap,
  Inbox,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const metadata: Metadata = {
  title: "Admissions",
  robots: { index: false, follow: false },
};

export default async function AdminAdmissionsPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/admissions`);
  }

  if (!hasPermission(user.role, PERMISSIONS.ADMISSION_READ)) {
    redirect("/admin/unauthorized");
  }

  const admissions = new AdmissionsService();
  const [
    { total: periodTotal },
    { total: inquiryTotal },
    { total: pendingTotal },
  ] = await Promise.all([
    admissions.listPeriods({ skip: 0, take: 1 }),
    admissions.listInquiries({ skip: 0, take: 1 }),
    admissions.listInquiries({ skip: 0, take: 1, status: "PENDING" }),
  ]);

  const stats = [
    {
      href: "/admin/admissions/periods",
      icon: CalendarClock,
      label: "Admission Periods",
      value: periodTotal,
      description: "Opening/closing dates and admission status per category.",
      action: "Manage Periods",
    },
    {
      href: "/admin/admissions/inquiries",
      icon: Inbox,
      label: "Applications",
      value: inquiryTotal,
      description: "Admission applications submitted from the public website.",
      action: "Manage Applications",
      badge: pendingTotal > 0 ? `${pendingTotal} pending` : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Admissions Module
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Control admission periods, status and requirements, and review
            applications submitted from the public website.
          </p>
        </div>
        <Link
          href="/admin/admissions/periods/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Period
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                <stat.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex items-center gap-2">
                {stat.badge ? (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {stat.badge}
                  </span>
                ) : null}
                <span className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </span>
              </span>
            </div>
            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              {stat.label}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {stat.description}
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-slate-700">
              {stat.action} →
            </span>
          </Link>
        ))}

        <Link
          href="/admin/admissions/requirements"
          className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {periodTotal > 0 ? "Manage" : "—"}
            </span>
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">
            Requirements
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Eligibility, documents, process, dates, fees and instructions per
            period.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-slate-700">
            Manage Requirements →
          </span>
        </Link>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">
            Admission Status
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Set each period to COMING_SOON, OPEN or CLOSED from the Admission
            Periods section. The public website reflects the current status
            automatically and closed periods do not accept applications.
          </p>
        </div>
      </div>
    </div>
  );
}
