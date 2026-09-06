import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { TestimonialService } from "@/services/testimonials";

// In-memory cache with TTL for testimonial list
const testimonialCache = new Map<string, { data: unknown; expiry: number }>();
const DEFAULT_TESTIMONIAL_TTL = 60 * 10; // 10 minutes

export const GET = withApiHandler(async () => {
  const now = Date.now();
  const cacheKey = "testimonials:published";

  // Check cache
  const cached = testimonialCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return jsonSuccess(cached.data, "Testimonials retrieved successfully");
  }

  // Fetch fresh data
  const testimonials = await new TestimonialService().listPublished({ take: 10 });

  // Store in cache
  testimonialCache.set(cacheKey, { data: testimonials, expiry: now + DEFAULT_TESTIMONIAL_TTL });

  return jsonSuccess(testimonials, "Testimonials retrieved successfully");
});