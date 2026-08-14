import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { TestimonialService } from "@/services/testimonials";

export const GET = withApiHandler(async () => {
  const testimonials = await new TestimonialService().listPublished();

  return jsonSuccess(testimonials, "Testimonials retrieved successfully");
});
