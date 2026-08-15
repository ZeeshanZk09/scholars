import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ComputerCourseService } from "@/services/computer-courses";
import { ComputerCourseForm } from "../../../_components/computer-courses/computer-course-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Computer Course",
  robots: { index: false, follow: false },
};

export default async function EditComputerCoursePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/computer-courses/courses`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let course;

  try {
    course = await new ComputerCourseService().getById(id);
  } catch {
    notFound();
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
        <h1 className="text-lg font-semibold text-slate-900">Edit Course</h1>
        <p className="mt-1 text-sm text-slate-600">{course.name}</p>
      </div>

      <ComputerCourseForm
        mode="edit"
        initial={{
          id: course.id,
          name: course.name,
          slug: course.slug,
          shortDescription: course.shortDescription ?? "",
          detailedDescription: course.detailedDescription ?? "",
          duration: course.duration ?? "",
          eligibility: course.eligibility ?? "",
          courseOutline: course.courseOutline,
          instructor: course.instructor ?? "",
          timing: course.timing ?? "",
          fee: course.fee ?? "",
          admissionStatus: course.admissionStatus ?? "",
          isFeatured: course.isFeatured,
          status: course.status,
          displayOrder: course.displayOrder,
        }}
      />
    </div>
  );
}
