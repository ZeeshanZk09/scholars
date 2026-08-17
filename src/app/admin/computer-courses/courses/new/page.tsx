import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { ComputerCourseForm } from "../../../_components/computer-courses/computer-course-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Computer Course",
  robots: { index: false, follow: false },
};

export default async function NewComputerCoursePage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/computer-courses/courses`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/computer-courses/courses"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Course</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a computer course with title, outline, duration and schedule.
        </p>
      </div>

      <ComputerCourseForm mode="create" />
    </div>
  );
}
