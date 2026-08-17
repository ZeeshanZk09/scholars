import { ArrowLeft, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DeleteButton } from "../../_components/school/delete-button";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SiteSettingService } from "@/services/settings";

export const metadata: Metadata = {
  title: "Site Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSiteSettingsListPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/settings/items`);
  }

  if (!hasPermission(user.role, PERMISSIONS.SETTINGS_READ)) {
    redirect("/admin/unauthorized");
  }

  const canManage = hasPermission(user.role, PERMISSIONS.SETTINGS_UPDATE);
  const settings = await new SiteSettingService().listForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/settings"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Settings
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Global site settings as key-value pairs.
          </p>
        </div>
        {canManage ? (
          <Link
            href="/admin/settings/items/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Setting
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Key</th>
              <th className="hidden px-4 py-3 md:table-cell">Group</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settings.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No site settings yet.
                </td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {setting.key}
                    {setting.description ? (
                      <span className="block text-xs font-normal text-slate-500">
                        {setting.description}
                      </span>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {setting.group ?? "general"}
                    </span>
                  </td>
                  <td className="max-w-md truncate px-4 py-3 text-slate-600">
                    {setting.value ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {canManage ? (
                        <Link
                          href={`/admin/settings/items/${setting.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Pencil className="h-4 w-4 text-slate-300" />
                      )}
                      {canManage ? (
                        <DeleteButton
                          id={setting.id}
                          endpoint="/api/v1/admin/site-settings"
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
