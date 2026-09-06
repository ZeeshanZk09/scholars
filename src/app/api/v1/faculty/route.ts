import { withApiHandler } from "@/lib/api/api-handler";
import { parsePagination } from "@/lib/api/pagination";
import { jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { FacultyService } from "@/services/faculty";

// In-memory cache with TTL for faculty list
const facultyCache = new Map<string, { data: unknown; expiry: number }>();
const DEFAULT_FACULTY_TTL = 60 * 10; // 10 minutes

interface FacultyCacheData {
  items: unknown[];
  total: number;
  page: number;
  limit: number;
}

export const GET = withApiHandler(async (_ctx, request) => {
  const now = Date.now();
  const url = new URL(request.url);
  const cacheKey = `faculty:list:${url.searchParams.get("department") || "all"}`;

  // Check cache
  const cached = facultyCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    const data = cached.data as FacultyCacheData;
    return jsonSuccessPaged(
      data.items,
      paginationMeta(data.page, data.limit, data.total),
      "Faculty retrieved successfully",
    );
  }

  // Fetch fresh data
  const { page, limit, skip, take } = parsePagination(url);
  const department = url.searchParams.get("department") || undefined;
  const { items, total } = await new FacultyService().listPublished({
    skip,
    take,
    department,
  });

  // Store in cache
  facultyCache.set(cacheKey, {
    data: {
      items,
      total,
      page,
      limit,
    },
    expiry: now + DEFAULT_FACULTY_TTL,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Faculty retrieved successfully",
  );
});