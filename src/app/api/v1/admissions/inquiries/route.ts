import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated } from "@/lib/response/api-response";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { createAdmissionInquirySchema } from "@/schemas/admission/admission.schema";
import { AdmissionsService } from "@/services/admissions";

export const POST = withApiHandler(async (_ctx, request) => {
  const ip = getClientIp(request);

  rateLimit({ key: `inquiry:${ip}`, limit: 5, windowMs: 60_000 });

  const input = await parseJsonBody(request, createAdmissionInquirySchema);

  const inquiry = await new AdmissionsService().createInquiry(input);

  return jsonCreated(inquiry, "Admission inquiry submitted successfully");
});
