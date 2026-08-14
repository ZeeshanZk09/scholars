import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BannerForm } from "../../_components/banners/banner-form";

export const metadata: Metadata = {
  title: "New Banner",
  robots: { index: false, follow: false },
};

export default async function NewBannerPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/banners/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.BANNER_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/banners/list"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Banners
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Banner</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a banner with an image, optional link and display order.
        </p>
      </div>

      <BannerForm mode="create" />
    </div>
  );
}