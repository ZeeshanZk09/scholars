import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BlogCategoryForm } from "../../../_components/blogs/category-form";

import type { Metadata } from "next";
import type { User } from "next-auth";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const metadata: Metadata = {
  title: "Edit Blog Category",
  robots: { index: false, follow: false },
};

export default async function EditBlogCategoryPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect("/auth/login?callbackUrl=/admin/blogs/categories");
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  const categories = await new BlogService().listAllCategories();
  const category = categories.find((item) => item.id === id);

  if (!category) {
    notFound();
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
          Edit Blog Category
        </h1>
        <p className="mt-1 text-sm text-slate-600">{category.name}</p>
      </div>

      <BlogCategoryForm
        mode="edit"
        initial={{
          id: category.id,
          name: category.name,
          description: category.description ?? "",
          status: category.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        }}
      />
    </div>
  );
}
