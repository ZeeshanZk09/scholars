import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ManagementForm } from "../../_components/management/management-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Management Member",
  robots: { index: false, follow: false },
};

export default async function NewManagementPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/management/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.MANAGEMENT_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/management"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Management
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">
          New Management Member
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a management team member to display on the website.
        </p>
      </div>

      <ManagementForm mode="create" />
    </div>
  );
}
