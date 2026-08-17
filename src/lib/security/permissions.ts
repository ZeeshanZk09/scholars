import { USER_ROLES, type Role } from "@/types/auth/roles.types";

export const PERMISSIONS = {
  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  CMS_READ: "cms:read",
  CMS_CREATE: "cms:create",
  CMS_UPDATE: "cms:update",
  CMS_DELETE: "cms:delete",
  ADMISSION_READ: "admission:read",
  ADMISSION_MANAGE: "admission:manage",
  BLOG_READ: "blog:read",
  BLOG_CREATE: "blog:create",
  BLOG_UPDATE: "blog:update",
  BLOG_DELETE: "blog:delete",
  BANNER_READ: "banner:read",
  BANNER_CREATE: "banner:create",
  BANNER_UPDATE: "banner:update",
  BANNER_DELETE: "banner:delete",
  TESTIMONIAL_READ: "testimonial:read",
  TESTIMONIAL_CREATE: "testimonial:create",
  TESTIMONIAL_UPDATE: "testimonial:update",
  TESTIMONIAL_DELETE: "testimonial:delete",
  PRINCIPAL_READ: "principal:read",
  PRINCIPAL_CREATE: "principal:create",
  PRINCIPAL_UPDATE: "principal:update",
  PRINCIPAL_DELETE: "principal:delete",
  MANAGEMENT_READ: "management:read",
  MANAGEMENT_CREATE: "management:create",
  MANAGEMENT_UPDATE: "management:update",
  MANAGEMENT_DELETE: "management:delete",
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role-to-permission matrix.
 * SUPER_ADMIN receives full access via the wildcard.
 *
 * Mapping follows PHASES.md Phase 05:
 * - SUPER_ADMIN: full system access, user management, CMS, settings
 * - ADMIN:       CMS management, admissions, blogs, content management
 * - EDITOR:      blogs, banners, content, testimonials
 */
const ROLE_PERMISSIONS: Record<Role, readonly Permission[] | "ALL"> = {
  [USER_ROLES.SUPER_ADMIN]: "ALL",
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.CMS_READ,
    PERMISSIONS.CMS_CREATE,
    PERMISSIONS.CMS_UPDATE,
    PERMISSIONS.CMS_DELETE,
    PERMISSIONS.ADMISSION_READ,
    PERMISSIONS.ADMISSION_MANAGE,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_UPDATE,
    PERMISSIONS.BLOG_DELETE,
    PERMISSIONS.PRINCIPAL_READ,
    PERMISSIONS.PRINCIPAL_CREATE,
    PERMISSIONS.PRINCIPAL_UPDATE,
    PERMISSIONS.PRINCIPAL_DELETE,
    PERMISSIONS.MANAGEMENT_READ,
    PERMISSIONS.MANAGEMENT_CREATE,
    PERMISSIONS.MANAGEMENT_UPDATE,
    PERMISSIONS.MANAGEMENT_DELETE,
  ],
  [USER_ROLES.EDITOR]: [
    PERMISSIONS.CMS_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_UPDATE,
    PERMISSIONS.BLOG_DELETE,
    PERMISSIONS.BANNER_READ,
    PERMISSIONS.BANNER_CREATE,
    PERMISSIONS.BANNER_UPDATE,
    PERMISSIONS.BANNER_DELETE,
    PERMISSIONS.TESTIMONIAL_READ,
    PERMISSIONS.TESTIMONIAL_CREATE,
    PERMISSIONS.TESTIMONIAL_UPDATE,
    PERMISSIONS.TESTIMONIAL_DELETE,
    PERMISSIONS.PRINCIPAL_READ,
    PERMISSIONS.PRINCIPAL_CREATE,
    PERMISSIONS.PRINCIPAL_UPDATE,
    PERMISSIONS.PRINCIPAL_DELETE,
    PERMISSIONS.MANAGEMENT_READ,
    PERMISSIONS.MANAGEMENT_CREATE,
    PERMISSIONS.MANAGEMENT_UPDATE,
    PERMISSIONS.MANAGEMENT_DELETE,
  ],
};

export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) {
    return false;
  }

  const granted = ROLE_PERMISSIONS[role];

  if (granted === "ALL") {
    return true;
  }

  return granted.includes(permission);
}

export function hasRole(role: Role | undefined, allowedRoles: readonly Role[]): boolean {
  return role !== undefined && allowedRoles.includes(role);
}

/**
 * Roles permitted to enter the staff admin area at all. Any authenticated user
 * whose role is not in this list is redirected away from `/admin` (defense in
 * depth — individual routes still enforce fine-grained permissions on top).
 */
export const ADMIN_ACCESSIBLE_ROLES: readonly Role[] = [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.EDITOR,
];

export function getPermissionsForRole(role: Role | undefined): readonly Permission[] {
  if (!role) {
    return [];
  }

  const granted = ROLE_PERMISSIONS[role];

  if (granted === "ALL") {
    return Object.values(PERMISSIONS);
  }

  return granted;
}

/**
 * Admin sidebar modules and the minimum permission required to access each.
 * Used to hide/disable unauthorized admin UI actions.
 */
export const ADMIN_MODULES = {
  dashboard: {
    label: "Dashboard",
    href: "/admin",
    permission: null,
  },
  users: {
    label: "Users",
    href: "/admin/users",
    permission: PERMISSIONS.USER_READ,
  },
  roles: {
    label: "Roles & Permissions",
    href: "/admin/roles",
    permission: PERMISSIONS.USER_READ,
  },
  banners: {
    label: "Banners",
    href: "/admin/banners",
    permission: PERMISSIONS.BANNER_READ,
  },
  pages: {
    label: "Pages & SEO",
    href: "/admin/pages",
    permission: PERMISSIONS.CMS_READ,
  },
  principal: {
    label: "Principal Message",
    href: "/admin/principal",
    permission: PERMISSIONS.CMS_READ,
  },
  management: {
    label: "Management",
    href: "/admin/management",
    permission: PERMISSIONS.CMS_READ,
  },
  faculty: {
    label: "Faculty",
    href: "/admin/faculty",
    permission: PERMISSIONS.CMS_READ,
  },
  testimonials: {
    label: "Testimonials",
    href: "/admin/testimonials",
    permission: PERMISSIONS.TESTIMONIAL_READ,
  },
  admissions: {
    label: "Admissions",
    href: "/admin/admissions",
    permission: PERMISSIONS.ADMISSION_READ,
  },
  school: {
    label: "School",
    href: "/admin/school",
    permission: PERMISSIONS.CMS_READ,
  },
  college: {
    label: "College",
    href: "/admin/college",
    permission: PERMISSIONS.CMS_READ,
  },
  programs: {
    label: "Programs",
    href: "/admin/programs",
    permission: PERMISSIONS.CMS_READ,
  },
  coaching: {
    label: "Coaching",
    href: "/admin/coaching",
    permission: PERMISSIONS.CMS_READ,
  },
  "computer-courses": {
    label: "Computer Courses",
    href: "/admin/computer-courses",
    permission: PERMISSIONS.CMS_READ,
  },
  facilities: {
    label: "Facilities",
    href: "/admin/facilities",
    permission: PERMISSIONS.CMS_READ,
  },
  blogs: {
    label: "Blogs",
    href: "/admin/blogs",
    permission: PERMISSIONS.BLOG_READ,
  },
  "blog-categories": {
    label: "Blog Categories",
    href: "/admin/blogs/categories",
    permission: PERMISSIONS.BLOG_READ,
  },
  "blog-tags": {
    label: "Blog Tags",
    href: "/admin/blogs/tags",
    permission: PERMISSIONS.BLOG_READ,
  },
  contact: {
    label: "Contact Inquiries",
    href: "/admin/contact",
    permission: PERMISSIONS.CMS_READ,
  },
  navigation: {
    label: "Navigation",
    href: "/admin/navigation",
    permission: PERMISSIONS.CMS_READ,
  },
  settings: {
    label: "Settings",
    href: "/admin/settings",
    permission: PERMISSIONS.SETTINGS_READ,
  },
} as const;

export type AdminModule = keyof typeof ADMIN_MODULES;

export function getAccessibleModules(role: Role | undefined): AdminModule[] {
  if (!role) {
    return [];
  }

  const modules = Object.entries(ADMIN_MODULES) as Array<
    [AdminModule, (typeof ADMIN_MODULES)[AdminModule]]
  >;

  return modules
    .filter(([, config]) => config.permission === null || hasPermission(role, config.permission))
    .map(([key]) => key);
}
