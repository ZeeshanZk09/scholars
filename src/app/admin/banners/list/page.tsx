import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BannerService } from "@/services/banners";
import { DeleteButton } from "../../_components/school/delete-button";

export const metadata: Metadata = {
  title: "Banners List",
  robots: { index: false, follow: false },
};

export default async function AdminBannersListPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/banners/list`);
  }

  if (!hasPermission(user.role, PERMISSIONS.BANNER_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.BANNER_CREATE);
  const canDelete = hasPermission(user.role, PERMISSIONS.BANNER_DELETE);
  const { items: banners } = await new BannerService().listForAdmin({ skip: 0, take: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/banners"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Banners
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Banners</h1>
          <p className="mt-1 text-sm text-slate-600">
            Banners with images, links and display order shown on the public website.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Banner
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Title</th>
              <th className="hidden px-4 py-3 md:table-cell">CTA</th>
              <th className="hidden px-4 py-3 lg:table-cell">Period</th>
              <th className="hidden px-4 py-3 md:table-cell">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Display Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {banners.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No banners yet.
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {banner.title}
                    <span className="block text-xs font-normal text-slate-500">
                      {banner.subtitle ?? banner.imageUrl}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {banner.ctaLabel ? (
                      <span>{banner.ctaLabel}</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-slate-500 lg:table-cell">
                    {banner.startDate || banner.endDate ? (
                      <>
                        {banner.startDate ? banner.startDate.toISOString().slice(0, 10) : "…"}
                        {" → "}
                        {banner.endDate ? banner.endDate.toISOString().slice(0, 10) : "∞"}
                      </>
                    ) : (
                      <span className="text-slate-400">Always</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {banner.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {banner.displayOrder}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {hasPermission(user.role, PERMISSIONS.BANNER_UPDATE) ? (
                        <Link
                          href={`/admin/banners/${banner.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Pencil className="h-4 w-4 text-slate-300" />
                      )}
                      {canDelete ? (
                        <DeleteButton
                          id={banner.id}
                          endpoint="/api/v1/admin/banners"
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