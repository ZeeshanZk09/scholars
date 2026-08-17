import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { ManagementService } from "@/services/management";

export const GET = withApiHandler(async () => {
  const members = await new ManagementService().listPublished();

  return jsonSuccess(members, "Management members retrieved successfully");
});
