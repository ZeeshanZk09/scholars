import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteSettingForm } from "../../../_components/settings/site-setting-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Site Setting",
  robots: { index: false, follow: false },
};

export default async function NewSiteSettingPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/settings/items`);
  }

  if (!hasPermission(user.role, PERMISSIONS.SETTINGS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/settings/items"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Settings
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Setting</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a key-value site setting.
        </p>
      </div>

      <SiteSettingForm mode="create" />
    </div>
  );
}
