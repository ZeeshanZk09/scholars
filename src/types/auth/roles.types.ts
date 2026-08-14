export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
} as const;

export type Role = (typeof USER_ROLES)[keyof typeof USER_ROLES];
