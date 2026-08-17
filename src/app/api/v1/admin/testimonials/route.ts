import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { createTestimonialSchema } from "@/schemas/testimonial/testimonial.schema";
import { requireApiPermission } from "@/server/auth";
import { TestimonialService } from "@/services/testimonials";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.TESTIMONIAL_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new TestimonialService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Testimonials retrieved successfully"
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.TESTIMONIAL_CREATE);

  const input = await parseJsonBody(request, createTestimonialSchema);

  const testimonial = await new TestimonialService().create(input, actor);

  return jsonCreated(testimonial, "Testimonial created successfully");
});
