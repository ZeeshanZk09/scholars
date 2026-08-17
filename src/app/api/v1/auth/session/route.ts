import { withApiHandler } from "@/lib/api/api-handler";
import { auth } from "@/lib/auth";
import { jsonSuccess } from "@/lib/response/api-response";

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
