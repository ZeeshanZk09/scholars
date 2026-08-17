import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BlogCategoryForm } from "../../../_components/blogs/category-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Blog Category",
  robots: { index: false, follow: false },
};

export default async function NewBlogCategoryPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect("/auth/login?callbackUrl=/admin/blogs/categories/new");
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blogs/categories"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog Categories
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">
          New Blog Category
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a topic to group related blog posts.
        </p>
      </div>

      <BlogCategoryForm mode="create" />
    </div>
  );
}
