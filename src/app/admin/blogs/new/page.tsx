import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { BlogEditorForm } from "./blog-editor-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const metadata: Metadata = {
  title: "New Blog Post",
  robots: { index: false, follow: false },
};

const EDUCATIONAL_SEGMENTS = [
  { serviceId: "school", title: "School" },
  { serviceId: "college", title: "College" },
  { serviceId: "coaching", title: "Coaching" },
  { serviceId: "computer-courses", title: "Computer Courses" },
];

export default async function NewBlogPostPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/blogs/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_CREATE)) {
    redirect("/admin/unauthorized");
  }

  const categories = await new BlogService().listCategories();
  const tags = await new BlogService().listTags();

  return (
    <BlogEditorForm
      authorName={user.name ?? user.email ?? ""}
      categories={categories.map((category) => category.name)}
      tags={tags.map((tag) => ({ id: tag.id, name: tag.name }))}
      services={EDUCATIONAL_SEGMENTS}
    />
  );
}
