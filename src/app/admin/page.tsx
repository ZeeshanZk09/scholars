import {
  BookOpenCheck,
  Building,
  ClipboardList,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Inbox,
  Menu,
  Monitor,
  Newspaper,
  Quote,
  Settings,
  Users,
} from "lucide-react";

import {
  ADMIN_MODULES,
  getAccessibleModules,
} from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";
import { BannerService } from "@/services/banners";
import { BlogService } from "@/services/blogs";
import { CoachingProgramService } from "@/services/coaching";
import { ComputerCourseService } from "@/services/computer-courses";
import { ContactService } from "@/services/contact";
import { FacilityService } from "@/services/facilities";
import { NavigationService } from "@/services/navigation";
import { PageService } from "@/services/pages";
import { ProgramService } from "@/services/programs";
import { SiteSettingService } from "@/services/settings";
import { TestimonialService } from "@/services/testimonials";
import { UserService } from "@/services/users";

const STAT_ICONS = {
  users: Users,
  pages: FileText,
  blogs: Newspaper,
  programs: BookOpenCheck,
  coaching: GraduationCap,
  "computer-courses": Monitor,
  banners: ImageIcon,
  testimonials: Quote,
  facilities: Building,
  admissions: ClipboardList,
  contact: Inbox,
  navigation: Menu,
  settings: Settings,
} as const;

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const accessibleModules = getAccessibleModules(user.role);
  const modules = Object.entries(ADMIN_MODULES).filter(([key]) => key !== "dashboard");

  const [
    usersResult,
    pages,
    blogs,
    programsResult,
    coachingResult,
    computerCoursesResult,
    bannersResult,
    testimonialsResult,
    facilitiesResult,
    periodsResult,
    inquiriesResult,
    contactResult,
    contactNewResult,
    navigation,
    siteSettings,
  ] = await Promise.all([
    new UserService().listForAdmin({ skip: 0, take: 1 }),
    new PageService().listForAdmin(),
    new BlogService().listBlogs(),
    new ProgramService().listForAdmin({ skip: 0, take: 1 }),
    new CoachingProgramService().listForAdmin({ skip: 0, take: 1 }),
    new ComputerCourseService().listForAdmin({ skip: 0, take: 1 }),
    new BannerService().listForAdmin({ skip: 0, take: 1 }),
    new TestimonialService().listForAdmin({ skip: 0, take: 1 }),
    new FacilityService().listForAdmin({ skip: 0, take: 1 }),
    new AdmissionsService().listPeriods({ skip: 0, take: 1 }),
    new AdmissionsService().listInquiries({ skip: 0, take: 1 }),
    new ContactService().listForAdmin({ skip: 0, take: 1 }),
    new ContactService().listForAdmin({ skip: 0, take: 1, status: "NEW" }),
    new NavigationService().listForAdmin(),
    new SiteSettingService().listForAdmin(),
  ]);

  const stats: Record<string, { count: number; note: string }> = {
    users: { count: usersResult.total, note: "Registered users" },
    pages: { count: pages.length, note: "Pages & SEO entries" },
    blogs: { count: blogs.length, note: "Blog posts" },
    programs: { count: programsResult.total, note: "College programs" },
    coaching: { count: coachingResult.total, note: "Coaching programs" },
    "computer-courses": { count: computerCoursesResult.total, note: "Computer courses" },
    banners: { count: bannersResult.total, note: "Banners" },
    testimonials: { count: testimonialsResult.total, note: "Testimonials" },
    facilities: { count: facilitiesResult.total, note: "Facilities" },
    admissions: { count: periodsResult.total, note: `${inquiriesResult.total} total inquiries` },
    contact: { count: contactResult.total, note: `${contactNewResult.total} new messages` },
    navigation: { count: navigation.length, note: "Navigation items" },
    settings: { count: siteSettings.length, note: "Site settings" },
  };

  const withCounts = modules.filter(
    ([key]) =>
      key in stats &&
      accessibleModules.includes(key as keyof typeof ADMIN_MODULES),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {user.name ?? user.email}. Signed in as{" "}
          <span className="font-medium text-slate-900">{user.role}</span>.
        </p>
      </div>

      <section
        aria-label="Content overview"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {withCounts.map(([key, config]) => {
          const Icon = STAT_ICONS[key as keyof typeof STAT_ICONS];

          return (
            <a
              key={key}
              href={config.href}
              className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  {Icon ? <Icon className="h-4.5 w-4.5" aria-hidden="true" /> : null}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {stats[key as keyof typeof stats]!.count}
                </span>
              </div>
              <h2 className="mt-3 text-sm font-semibold text-slate-900">{config.label}</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {stats[key as keyof typeof stats]!.note}
              </p>
            </a>
          );
        })}
      </section>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Role restrictions are enforced server-side. Unauthorized modules are hidden from your
        sidebar and their APIs reject direct access with a{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">403</code>
        <span>.</span>
      </div>

      <section aria-label="Module access" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(([key, config]) => {
          const accessible = accessibleModules.includes(key as keyof typeof ADMIN_MODULES);

          return (
            <a
              key={key}
              href={accessible ? config.href : undefined}
              className={`rounded-lg border p-4 ${
                accessible ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">{config.label}</h2>
                {accessible ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Accessible
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    Restricted
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {accessible ? "Available to your role." : `Not available to ${user.role}.`}
              </p>
            </a>
          );
        })}
      </section>
    </div>
  );
}