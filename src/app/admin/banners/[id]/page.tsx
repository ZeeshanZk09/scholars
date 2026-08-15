import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BannerService } from "@/services/banners";
import { BannerForm } from "../../_components/banners/banner-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Banner",
  robots: { index: false, follow: false },
};

export default async function EditBannerPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/banners/list`);
  }

  if (!hasPermission(user.role, PERMISSIONS.BANNER_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let banner;

  try {
    banner = await new BannerService().getById(id);
  } catch {
    notFound();
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
        <h1 className="text-lg font-semibold text-slate-900">Edit Banner</h1>
        <p className="mt-1 text-sm text-slate-600">{banner.title}</p>
      </div>

      <BannerForm
        mode="edit"
        initial={{
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle ?? "",
          description: banner.description ?? "",
          imageUrl: banner.imageUrl,
          linkUrl: banner.linkUrl ?? "",
          ctaLabel: banner.ctaLabel ?? "",
          startDate: banner.startDate ? banner.startDate.toISOString().slice(0, 16) : "",
          endDate: banner.endDate ? banner.endDate.toISOString().slice(0, 16) : "",
          status: banner.status,
          displayOrder: banner.displayOrder,
        }}
      />
    </div>
  );
}
