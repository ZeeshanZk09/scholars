import { Plus, Settings2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SiteSettingService } from "@/services/settings";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/settings`);
  }

  if (!hasPermission(user.role, PERMISSIONS.SETTINGS_READ)) {
    redirect("/admin/unauthorized");
  }

  const canManage = hasPermission(user.role, PERMISSIONS.SETTINGS_UPDATE);
  const settings = await new SiteSettingService().listForAdmin();

  const groups = settings.reduce<Record<string, number>>((acc, setting) => {
    const group = setting.group ?? "general";
    acc[group] = (acc[group] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Site Settings
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Global key-value settings for the website — site name, tagline,
            contact details and more.
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

      <Link
        href="/admin/settings/items"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Settings2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">
            {settings.length}
          </span>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">
          All Settings
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {Object.entries(groups)
            .map(([group, count]) => `${group} (${count})`)
            .join(" · ") || "No settings yet"}
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Settings →
        </span>
      </Link>
    </div>
  );
}
