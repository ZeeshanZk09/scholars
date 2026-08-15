import { AuthorizationError } from "@/lib/errors";
import { env } from "@/config/env";

/**
 * CSRF defense for cookie-based custom endpoints. Modern browsers always send
 * an Origin header on state-changing requests, so a mismatch proves the request
 * is cross-site. Requests without an Origin (curl, scripts, same-origin GETs)
 * are permitted so non-browser clients keep working.
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");

  if (!origin) {
    return;
  }

  const appUrl = env.APP_URL;
  const appOrigin = new URL(appUrl).origin;

  if (new URL(origin).origin !== appOrigin) {
    throw new AuthorizationError("Cross-origin request rejected.");
  }
}