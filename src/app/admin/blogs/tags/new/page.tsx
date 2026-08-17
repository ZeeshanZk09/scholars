import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BlogTagForm } from "../../../_components/blogs/tag-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Blog Tag",
  robots: { index: false, follow: false },
};

export default async function NewBlogTagPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect("/auth/login?callbackUrl=/admin/blogs/tags/new");
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blogs/tags"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog Tags
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Blog Tag</h1>
        <p className="mt-1 text-sm text-slate-600">Create a keyword label for blog posts.</p>
      </div>

      <BlogTagForm mode="create" />
    </div>
  );
}
