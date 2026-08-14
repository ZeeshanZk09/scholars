import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { FacilityService } from "@/services/facilities";

export const GET = withApiHandler(async () => {
  const facilities = await new FacilityService().listPublished();

  return jsonSuccess(facilities, "Facilities retrieved successfully");
});
