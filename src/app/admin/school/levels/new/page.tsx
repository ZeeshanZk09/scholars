import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { LevelForm } from "../../../_components/school/level-form";

export const metadata: Metadata = {
  title: "New Academic Level",
  robots: { index: false, follow: false },
};

export default async function NewAcademicLevelPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/school/levels/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/school/levels"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Levels
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Academic Level</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a stage that groups school classes, e.g. Primary.
        </p>
      </div>

      <LevelForm mode="create" />
    </div>
  );
}