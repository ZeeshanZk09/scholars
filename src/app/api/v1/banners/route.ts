import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { BannerService } from "@/services/banners";

// In-memory cache with TTL for banner list
const bannerCache = new Map<string, { data: unknown; expiry: number }>();
const DEFAULT_BANNER_TTL = 60 * 5; // 5 minutes

export const GET = withApiHandler(async () => {
  const now = Date.now();
  const cacheKey = "banners:published";

  // Check cache
  const cached = bannerCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return jsonSuccess(cached.data, "Banners retrieved successfully");
  }

  // Fetch fresh data
  const banners = await new BannerService().listPublished();

  // Store in cache
  bannerCache.set(cacheKey, { data: banners, expiry: now + DEFAULT_BANNER_TTL });

  return jsonSuccess(banners, "Banners retrieved successfully");
});