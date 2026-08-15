import { withApiHandler } from "@/lib/api/api-handler";
import { parsePagination } from "@/lib/api/pagination";
import { jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { FacultyService } from "@/services/faculty";

export const GET = withApiHandler(async (_ctx, request) => {
  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const department = url.searchParams.get("department") || undefined;

  const { items, total } = await new FacultyService().listPublished({ skip, take, department });

  return jsonSuccessPaged(items, paginationMeta(page, limit, total), "Faculty retrieved successfully");
});
