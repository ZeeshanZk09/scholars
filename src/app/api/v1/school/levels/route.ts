import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { SchoolService } from "@/services/academics";

export const GET = withApiHandler(async () => {
  const levels = await new SchoolService().listLevelsPublished();

  return jsonSuccess(levels, "School levels retrieved successfully");
});
