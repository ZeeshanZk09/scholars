import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { ProgramService } from "@/services/programs";

export const GET = withApiHandler(async () => {
  const programs = await new ProgramService().listPublished();

  return jsonSuccess(programs, "Programs retrieved successfully");
});
