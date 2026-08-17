import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { PrincipalService } from "@/services/principal";

export const GET = withApiHandler(async () => {
  const messages = await new PrincipalService().listPublished();

  return jsonSuccess(messages, "Principal messages retrieved successfully");
});
