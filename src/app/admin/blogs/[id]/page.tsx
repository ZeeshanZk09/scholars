import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { BlogService } from "@/services/blogs";
import { BlogEditorForm } from "../new/blog-editor-form";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  robots: { index: false, follow: false },
};

const EDUCATIONAL_SEGMENTS = [
  { serviceId: "school", title: "School" },
  { serviceId: "college", title: "College" },
  { serviceId: "coaching", title: "Coaching" },
  { serviceId: "computer-courses", title: "Computer Courses" },
];

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/blogs`);
  }

  if (!hasPermission(user.role, PERMISSIONS.BLOG_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let post;

  try {
    post = await new BlogService().getById(id);
  } catch {
    notFound();
  }

  const categories = await new BlogService().listCategories();

  return (
    <BlogEditorForm
      mode="edit"
      id={post.id}
      authorName={user.name ?? user.email ?? ""}
      categories={categories.map((category) => category.name)}
      services={EDUCATIONAL_SEGMENTS}
      initial={{
        title: post.title,
        content: post.content,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        featuredImage: post.featuredImage ?? "",
        categoryName: post.categories[0]?.name ?? "",
        status: post.status,
        seoTitle: post.seo[0]?.seoTitle ?? "",
        metaDescription: post.seo[0]?.metaDescription ?? "",
        keywords: post.seo[0]?.keywords ?? "",
      }}
    />
  );
}