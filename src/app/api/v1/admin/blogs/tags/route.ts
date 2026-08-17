import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createBlogTagSchema } from "@/schemas/blog/tag.schema";
import { requireApiPermission } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const GET = withApiHandler(async () => {
  await requireApiPermission(PERMISSIONS.BLOG_READ);

  const tags = await new BlogService().listAllTags();

  return jsonSuccess(tags, "Blog tags retrieved successfully");
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.BLOG_CREATE);

  const input = await parseJsonBody(request, createBlogTagSchema);

  const tag = await new BlogService().createTag(input, actor);

  return jsonCreated(tag, "Blog tag created successfully");
});
