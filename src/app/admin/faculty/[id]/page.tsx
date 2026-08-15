import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { FacultyService } from "@/services/faculty";
import { FacultyForm } from "@/features/faculty/components/faculty-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Faculty",
  robots: { index: false, follow: false },
};

export default async function EditFacultyPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/faculty`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let faculty;

  try {
    faculty = await new FacultyService().getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/faculty/list"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Faculty
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Faculty</h1>
        <p className="mt-1 text-sm text-slate-600">{faculty.name}</p>
      </div>

      <FacultyForm initialData={faculty} />
    </div>
  );
}
