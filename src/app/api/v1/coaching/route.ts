import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { CoachingProgramService } from "@/services/coaching";

export const GET = withApiHandler(async () => {
  const programs = await new CoachingProgramService().listPublished();

  return jsonSuccess(programs, "Coaching programs retrieved successfully");
});
