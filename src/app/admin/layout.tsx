import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Star,
  GraduationCap,
  Newspaper,
  Settings,
  Lock,
  Building2,
  School2,
  PenTool,
  Monitor,
  Building,
  BookOpenCheck,
  Inbox,
  Menu,
  UserIcon,
} from "lucide-react";
import { Toaster } from "sonner";

import { ADMIN_MODULES, getAccessibleModules, type AdminModule } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { LogoutButton } from "./logout-button";
import { User } from "next-auth";

const MODULE_ICONS: Record<AdminModule, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  users: Users,
  roles: ShieldCheck,
  banners: ImageIcon,
  pages: FileText,
  principal: UserIcon,
  management: Users,
  faculty: Users,
  testimonials: Star,
  admissions: GraduationCap,
  school: Building2,
  college: School2,
  programs: BookOpenCheck,
  coaching: PenTool,
  "computer-courses": Monitor,
  facilities: Building,
  blogs: Newspaper,
  contact: Inbox,
  navigation: Menu,
  settings: Settings,
};

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin`);
  }

  const accessibleModules = getAccessibleModules(user.role);
  const modules = Object.entries(ADMIN_MODULES) as Array<
    [AdminModule, (typeof ADMIN_MODULES)[AdminModule]]
  >;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
          <div className="flex h-14 items-center border-b border-slate-200 px-4">
            <span className="text-sm font-semibold text-slate-900">Scholar School Admin</span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {modules.map(([key, config]) => {
              const accessible = accessibleModules.includes(key);
              const Icon = MODULE_ICONS[key];

              if (!accessible) {
                return (
                  <span
                    key={key}
                    title={`Access restricted for ${user.role}`}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 opacity-60 select-none"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{config.label}</span>
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                );
              }

              return (
                <Link
                  key={key}
                  href={config.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-between border-t border-slate-200 p-3 text-sm text-slate-600">
            <span className="truncate">
              <span className="block truncate font-medium text-slate-800">
                {user.name ?? user.email}
              </span>
              <span className="text-xs text-slate-500">{user.role}</span>
            </span>
            <LogoutButton />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
            <span className="text-sm font-semibold text-slate-900 md:hidden">
              Scholar School Admin
            </span>
            <span className="hidden text-sm text-slate-500 md:inline">{user.email}</span>
            <div className="flex items-center gap-2 md:hidden">
              <LogoutButton />
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
