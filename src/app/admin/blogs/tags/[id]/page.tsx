import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BlogTagForm } from "../../../_components/blogs/tag-form";

import type { Metadata } from "next";
import type { User } from "next-auth";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const metadata: Metadata = {
  title: "Edit Blog Tag",
  robots: { index: false, follow: false },
};

export default async function EditBlogTagPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect("/auth/login?callbackUrl=/admin/blogs/tags");
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  const tags = await new BlogService().listAllTags();
  const tag = tags.find((item) => item.id === id);

  if (!tag) {
    notFound();
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
        <h1 className="text-lg font-semibold text-slate-900">Edit Blog Tag</h1>
        <p className="mt-1 text-sm text-slate-600">{tag.name}</p>
      </div>

      <BlogTagForm
        mode="edit"
        initial={{
          id: tag.id,
          name: tag.name,
        }}
      />
    </div>
  );
}
