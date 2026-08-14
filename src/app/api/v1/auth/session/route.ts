import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { auth } from "@/lib/auth";

export const GET = withApiHandler(async () => {
  const session = await auth();

  return jsonSuccess(
    {
      user: session?.user
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
          }
        : null,
    },
    "Session status retrieved successfully"
  );
});
