import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import type { Metadata } from "next";

import { FacultyForm } from "@/features/faculty/components/faculty-form";
import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Faculty",
  robots: { index: false, follow: false },
};

export default async function NewFacultyPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/faculty/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
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
        <h1 className="text-lg font-semibold text-slate-900">New Faculty</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a new faculty member profile.
        </p>
      </div>

      <FacultyForm />
    </div>
  );
}
