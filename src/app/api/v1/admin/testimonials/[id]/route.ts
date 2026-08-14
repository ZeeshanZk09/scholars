import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateTestimonialSchema } from "@/schemas/testimonial/testimonial.schema";
import { requireApiPermission } from "@/server/auth";
import { TestimonialService } from "@/services/testimonials";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.TESTIMONIAL_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateTestimonialSchema);

  const testimonial = await new TestimonialService().update(id, input, actor);

  return jsonSuccess(testimonial, "Testimonial updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.TESTIMONIAL_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new TestimonialService().remove(id);

  return jsonSuccess({ id }, "Testimonial deleted successfully");
});
