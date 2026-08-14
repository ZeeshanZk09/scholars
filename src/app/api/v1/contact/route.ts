import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated } from "@/lib/response/api-response";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { createContactMessageSchema } from "@/schemas/contact/contact.schema";
import { ContactService } from "@/services/contact";

export const POST = withApiHandler(async (_ctx, request) => {
  const ip = getClientIp(request);

  rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 60_000 });

  const input = await parseJsonBody(request, createContactMessageSchema);

  const message = await new ContactService().create(input);

  return jsonCreated(message, "Message sent successfully");
});