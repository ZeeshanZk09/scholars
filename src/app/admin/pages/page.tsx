import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { PageService } from "@/services/pages";

export const metadata: Metadata = {
  title: "Pages & SEO",
  robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/pages`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.CMS_CREATE);
  const pages = await new PageService().listForAdmin();
  const publishedCount = pages.filter((page) => page.status === "PUBLISHED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Pages & SEO Module</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage static pages, their content and search-engine metadata.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Page
          </Link>
        ) : null}
      </div>

      <Link
        href="/admin/pages/list"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">{pages.length}</span>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">Pages</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {publishedCount} published · {pages.length - publishedCount} draft/archived
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Pages →
        </span>
      </Link>
    </div>
  );
}