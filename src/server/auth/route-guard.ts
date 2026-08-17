import type { Role } from "@/types/auth/roles.types";

import { auth } from "@/lib/auth";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { hasPermission, type Permission } from "@/lib/security/permissions";
import { prisma } from "@/server/db/prisma";

export interface ApiUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

/**
 * Resolves the authenticated user for an API request.
 * Throws 401 (AuthenticationError) when the request is unauthenticated or the user no longer exists.
 */
export async function getApiUser(): Promise<ApiUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthenticationError("Authentication required.");
  }

  // Verify the user actually exists in the database.
  // This prevents 500 foreign-key errors if the database is reset but the browser cookie remains.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!dbUser) {
    throw new AuthenticationError("Session invalid. Please sign in again.");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };
}

/**
 * Route-handler guard: authenticates the request and enforces that the
 * authenticated role holds the required permission.
 *
 * Throws:
 * - 401 AuthenticationError when unauthenticated.
 * - 403 AuthorizationError when the role lacks the permission.
 *
 * Returning the user keeps the handler declarative and avoids a second
 * session lookup. Every sensitive API MUST call this before acting.
 */
export async function requireApiPermission(permission: Permission): Promise<ApiUser> {
  const user = await getApiUser();

  if (!hasPermission(user.role, permission)) {
    throw new AuthorizationError("You do not have permission to perform this action.");
  }

  return user;
}
