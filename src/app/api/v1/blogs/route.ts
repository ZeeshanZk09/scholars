import { withApiHandler } from "@/lib/api/api-handler";
import { parsePagination } from "@/lib/api/pagination";
import { jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { BlogService } from "@/services/blogs";

export const GET = withApiHandler(async (_ctx, request) => {
  const { page, limit, skip, take } = parsePagination(new URL(request.url));

  const { items, total } = await new BlogService().listPublished({
    skip,
    take,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Blog posts retrieved successfully"
  );
});
