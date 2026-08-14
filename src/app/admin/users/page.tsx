import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ShieldCheck, Users } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { UserService } from "@/services/users";

export const metadata: Metadata = {
  title: "Users",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/users`);
  }

  if (!hasPermission(user.role, PERMISSIONS.USER_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.USER_CREATE);
  const { total } = await new UserService().listForAdmin({ skip: 0, take: 1 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Users Module</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage admin users, their roles and the permissions granted to each role.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New User
          </Link>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/users/list"
          className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-2xl font-bold text-slate-900">{total}</span>
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">Users</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Admin users with roles, account status and last login information.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-slate-700">
            Manage Users →
          </span>
        </Link>

        <Link
          href="/admin/roles"
          className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">Roles & Permissions</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Role-based access matrix showing what each role can do across the admin system.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-slate-700">
            View Permissions →
          </span>
        </Link>
      </div>
    </div>
  );
}
