import { redirect } from "next/navigation";
import { type User } from "next-auth";

import type { Metadata } from "next";

import {
  getPermissionsForRole,
  hasPermission,
  PERMISSIONS,
} from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { USER_ROLES, type Role } from "@/types/auth/roles.types";

export const metadata: Metadata = {
  title: "Roles & Permissions",
  robots: { index: false, follow: false },
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Full system access, user management, CMS and settings",
  ADMIN: "CMS management, admissions, blogs and content management",
  EDITOR: "Blogs, banners, content and testimonials",
};

const PERMISSION_ENTRIES = Object.entries(PERMISSIONS) as Array<
  [keyof typeof PERMISSIONS, (typeof PERMISSIONS)[keyof typeof PERMISSIONS]]
>;

export default async function AdminRolesPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/roles`);
  }

  if (!hasPermission(user.role, PERMISSIONS.USER_READ)) {
    redirect("/admin/unauthorized");
  }

  const roles = Object.values(USER_ROLES);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Roles & Permissions
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Permissions granted to each role across the admin system.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <h2 className="text-sm font-semibold text-slate-900">{role}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Permission</th>
              {roles.map((role) => (
                <th key={role} className="px-4 py-3 text-center">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PERMISSION_ENTRIES.map(([key, permission]) => (
              <tr key={permission}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {key.replaceAll("_", " ")}
                  <span className="block text-xs font-normal text-slate-500">
                    {permission}
                  </span>
                </td>
                {roles.map((role) => (
                  <td key={role} className="px-4 py-3 text-center">
                    {getPermissionsForRole(role).includes(permission) ? (
                      <span
                        className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                        aria-label="Granted"
                      />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
