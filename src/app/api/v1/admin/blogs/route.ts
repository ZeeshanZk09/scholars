import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createBlogSchema } from "@/schemas/blog/blog.schema";
import { requireApiPermission } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const GET = withApiHandler(async () => {
  await requireApiPermission(PERMISSIONS.BLOG_READ);

  const blogs = await new BlogService().listBlogs();

  return jsonSuccess(blogs, "Blog posts retrieved successfully");
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.BLOG_CREATE);

  const input = await parseJsonBody(request, createBlogSchema);

  const blog = await new BlogService().createBlog(input, actor);

  return jsonCreated(blog, "Blog post created successfully");
});
