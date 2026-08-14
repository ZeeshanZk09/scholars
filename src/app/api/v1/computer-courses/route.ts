import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { ComputerCourseService } from "@/services/computer-courses";

export const GET = withApiHandler(async () => {
  const courses = await new ComputerCourseService().listPublished();

  return jsonSuccess(courses, "Computer courses retrieved successfully");
});
