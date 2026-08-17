import { Monitor, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ComputerCourseService } from "@/services/computer-courses";

export const metadata: Metadata = {
  title: "Computer Courses",
  robots: { index: false, follow: false },
};

export default async function AdminComputerCoursesPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/computer-courses`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const { total } = await new ComputerCourseService().listForAdmin({
    skip: 0,
    take: 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Computer Courses Module
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage computer education courses, outlines, schedules and admission
            status shown on the public Computer Courses page.
          </p>
        </div>
        <Link
          href="/admin/computer-courses/courses/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Course
        </Link>
      </div>

      <Link
        href="/admin/computer-courses/courses"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Monitor className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">{total}</span>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">Courses</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Computer courses with titles, outlines, durations, schedules, fees and
          admission status.
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Courses →
        </span>
      </Link>
    </div>
  );
}
