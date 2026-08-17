import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { ClassForm } from "../../../_components/school/class-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SchoolService } from "@/services/academics";

export const metadata: Metadata = {
  title: "New Class",
  robots: { index: false, follow: false },
};

export default async function NewSchoolClassPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/school/classes/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
  }

  const { items: levels } = await new SchoolService().listLevelsForAdmin({
    skip: 0,
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/school/classes"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Classes
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Class</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a class such as Nursery, KG or Grade 1.
        </p>
      </div>

      <ClassForm
        mode="create"
        levels={levels.map((level) => ({ id: level.id, name: level.name }))}
      />
    </div>
  );
}
