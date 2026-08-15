import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { PageService } from "@/services/pages";
import { PageForm } from "../../_components/pages/page-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Page",
  robots: { index: false, follow: false },
};

export default async function EditPageForm({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/pages`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let page;

  try {
    page = await new PageService().getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pages/list"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Pages
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Page</h1>
        <p className="mt-1 text-sm text-slate-600">{page.title}</p>
      </div>

      <PageForm
        mode="edit"
        initial={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content ?? "",
          featuredImage: page.featuredImage ?? "",
          layout: page.layout ?? "",
          status: page.status,
          publishedAt: page.publishedAt ? page.publishedAt.toISOString() : "",
          seoTitle: page.seo?.seoTitle ?? "",
          metaDescription: page.seo?.metaDescription ?? "",
          canonicalUrl: page.seo?.canonicalUrl ?? "",
          ogTitle: page.seo?.ogTitle ?? "",
          ogDescription: page.seo?.ogDescription ?? "",
          ogImage: page.seo?.ogImage ?? "",
          robots: page.seo?.robots ?? "",
        }}
      />
    </div>
  );
}
