import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { UserForm } from "../../_components/users/user-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New User",
  robots: { index: false, follow: false },
};

export default async function NewUserPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/users/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.USER_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users/list"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Users
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New User</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a new admin user with a role and account status.
        </p>
      </div>

      <UserForm mode="create" />
    </div>
  );
}
