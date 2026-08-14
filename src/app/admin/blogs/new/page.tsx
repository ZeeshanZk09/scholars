import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BlogService } from "@/services/blogs";
import { BlogEditorForm } from "./blog-editor-form";

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
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/blogs/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_CREATE)) {
    redirect("/admin/unauthorized");
  }

  const categories = await new BlogService().listCategories();

  return (
    <BlogEditorForm
      authorName={user.name ?? user.email ?? ""}
      categories={categories.map((category) => category.name)}
      services={EDUCATIONAL_SEGMENTS}
    />
  );
}