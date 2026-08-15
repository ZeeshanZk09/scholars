import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { NavigationService } from "@/services/navigation";
import { DeleteButton } from "../../_components/school/delete-button";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Navigation Items",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-amber-50 text-amber-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

export default async function AdminNavigationItemsPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/navigation/items`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.CMS_CREATE);
  const canDelete = hasPermission(user.role, PERMISSIONS.CMS_DELETE);
  const items = await new NavigationService().listForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/navigation"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Navigation
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Navigation Items</h1>
          <p className="mt-1 text-sm text-slate-600">
            Main and footer navigation links shown on the public website.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/navigation/items/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Item
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Label</th>
              <th className="hidden px-4 py-3 md:table-cell">URL</th>
              <th className="hidden px-4 py-3 md:table-cell">Position</th>
              <th className="hidden px-4 py-3 lg:table-cell">Parent</th>
              <th className="hidden px-4 py-3 md:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No navigation items yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {item.label}
                    <span className="block text-xs font-normal text-slate-500">
                      Order {item.displayOrder}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{item.url}</td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {item.position ?? "main"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                    {item.parent?.label ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[item.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {hasPermission(user.role, PERMISSIONS.CMS_UPDATE) ? (
                        <Link
                          href={`/admin/navigation/items/${item.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Pencil className="h-4 w-4 text-slate-300" />
                      )}
                      {canDelete ? (
                        <DeleteButton
                          id={item.id}
                          endpoint="/api/v1/admin/navigation"
                          label="Delete"
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
