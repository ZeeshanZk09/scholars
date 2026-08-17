import {
  Users,
  FileText,
  Image as ImageIcon,
  Star,
  GraduationCap,
  Newspaper,
  Settings,
  Monitor,
  Building,
  BookOpenCheck,
  Inbox,
  Menu,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { InquiryStatusButton } from "./_components/admissions/inquiry-status-button";

import {
  ADMIN_MODULES,
  getAccessibleModules,
  hasPermission,
  PERMISSIONS,
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
  testimonials: Star,
  facilities: Building,
  admissions: GraduationCap,
  contact: Inbox,
  navigation: Menu,
  settings: Settings,
} as const;

const INQUIRY_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-blue-50 text-blue-700",
};

export default async function AdminDashboardPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin`);
  }

  const accessibleModules = getAccessibleModules(user.role);
  const modules = Object.entries(ADMIN_MODULES);
  const canViewInquiries = hasPermission(user.role, PERMISSIONS.ADMISSION_READ);

  const [
    usersResult,
    pagesResult,
    blogsResult,
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
    canViewInquiries
      ? new AdmissionsService().listInquiries({ skip: 0, take: 100 })
      : Promise.resolve({ items: [], total: 0 }),
    new ContactService().listForAdmin({ skip: 0, take: 1 }),
    new ContactService().listForAdmin({ skip: 0, take: 1, status: "NEW" }),
    new NavigationService().listForAdmin(),
    new SiteSettingService().listForAdmin(),
  ]);

  const stats: Record<string, { count: number; note: string }> = {
    users: { count: usersResult.total, note: "Registered users" },
    pages: { count: pagesResult.length, note: "Pages & SEO entries" },
    blogs: { count: blogsResult.length, note: "Blog posts" },
    programs: { count: programsResult.total, note: "College programs" },
    coaching: { count: coachingResult.total, note: "Coaching programs" },
    "computer-courses": {
      count: computerCoursesResult.total,
      note: "Computer courses",
    },
    banners: { count: bannersResult.total, note: "Banners" },
    testimonials: { count: testimonialsResult.total, note: "Testimonials" },
    facilities: { count: facilitiesResult.total, note: "Facilities" },
    admissions: {
      count: periodsResult.total,
      note: `${inquiriesResult.total} total inquiries`,
    },
    contact: {
      count: contactResult.total,
      note: `${contactNewResult.total} new messages`,
    },
    navigation: { count: navigation.length, note: "Navigation items" },
    settings: { count: siteSettings.length, note: "Site settings" },
  };

  const withCounts = modules.filter(
    ([key]: [string, unknown]) =>
      key in stats &&
      accessibleModules.includes(key as keyof typeof ADMIN_MODULES),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <nav aria-label="Page navigation" className="flex gap-2">
          <ol className="flex items-center gap-1 bg-slate-50 rounded border border-slate-200 p-1">
            <li className="flex items-center gap-2">
              <Link
                href="/admin"
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="11" x2="21" y2="11" />
                  <path d="M7 7v5h4" />
                  <line x1="12" y1="17" x2="20" y2="11" />
                  <line x1="12" y1="7" x2="20" y2="7" />
                </svg>
                Overview
              </Link>
            </li>
            <li>
              <svg
                className="h-3.5 w-3.5 opacity-40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="11" x2="21" y2="11" />
                <path d="M7 7v5h4" />
                <line x1="12" y1="17" x2="20" y2="11" />
                <line x1="12" y1="7" x2="20" y2="7" />
              </svg>
              <span className="sr-only">You are here: Dashboard</span>
            </li>
          </ol>
        </nav>
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
                  {Icon ? (
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  ) : null}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {stats[key as keyof typeof stats]?.count}
                </span>
              </div>
              <h2 className="mt-3 text-sm font-semibold text-slate-900">
                {config.label}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {stats[key as keyof typeof stats]?.note}
              </p>
            </a>
          );
        })}
      </section>

      <section
        aria-label="Quick actions"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Plus className="h-3 w-3" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">New User</p>
              <p className="text-sm font-bold text-slate-900">Add User</p>
            </div>
          </div>
          <Link
            href="/admin/users/new"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Create User
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FileText className="h-3 w-3" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">New Page</p>
              <p className="text-sm font-bold text-slate-900">Add Page</p>
            </div>
          </div>
          <Link
            href="/admin/pages/new"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Create Page
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Newspaper className="h-3 w-3" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">New Blog</p>
              <p className="text-sm font-bold text-slate-900">Add Post</p>
            </div>
          </div>
          <Link
            href="/admin/blogs/new"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Create Blog
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <GraduationCap className="h-3 w-3" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">New Period</p>
              <p className="text-sm font-bold text-slate-900">
                Admission Period
              </p>
            </div>
          </div>
          <Link
            href="/admin/admissions/periods/new"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Create Period
          </Link>
        </div>
      </section>

      <section
        aria-label="Admission status"
        className="rounded-lg border border-slate-200 bg-white p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Admission Status
          </h2>
          <InquiryStatusButton id="current-period" current="PENDING" />
        </div>
        <p className="text-xs text-slate-500">
          Set each period to COMING_SOON, OPEN or CLOSED from the Admission
          Periods section. The public website reflects the current status
          automatically and closed periods do not accept applications.
        </p>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-slate-500"> Pending</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500"> Open</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-slate-500"> Closed</span>
          </div>
        </div>
      </section>

      {canViewInquiries && (
      <section
        aria-label="Recent inquiries"
        className="rounded-lg border border-slate-200 bg-white"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Inquiries
          </h2>
          <Link
            href="/admin/admissions/inquiries"
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            View all
          </Link>
        </div>

        <div className="h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Student</th>
                <th className="hidden px-4 py-3 md:table-cell">Program</th>
                <th className="hidden px-4 py-3 lg:table-cell">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiriesResult.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No inquiries yet.
                  </td>
                </tr>
              ) : (
                inquiriesResult.items.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {inquiry.studentName}
                      {inquiry.parentGuardianName && (
                        <span className="block text-xs font-normal text-slate-500">
                          Guardian: {inquiry.parentGuardianName}
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                      {inquiry.interestedProgram ??
                        inquiry.classOrCourse ??
                        "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                      {inquiry.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          INQUIRY_STATUS_COLORS[inquiry.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <InquiryStatusButton
                          id={inquiry.id}
                          current={
                            inquiry.status as "PENDING" | "CONTACTED" | "CLOSED"
                          }
                        />
                        <Link
                          href={"/admin/admissions/inquiries/" + inquiry.id}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-100"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      <section
        aria-label="Content statistics"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500">
            Blog Statistics
          </h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {blogsResult.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Posts published</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500">
            Program Statistics
          </h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {programsResult.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">College programs</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500">
            Facility Statistics
          </h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {facilitiesResult.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">Facilities managed</p>
        </div>
      </section>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Role restrictions are enforced server-side. Unauthorized modules are
        hidden from your sidebar and their APIs reject direct access with a{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
          403
        </code>
        <span>.</span>
      </div>

      <section
        aria-label="Module access"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {modules.map(([key, config]) => {
          const accessible = accessibleModules.includes(
            key as keyof typeof ADMIN_MODULES,
          );
          const className = accessible
            ? "rounded-lg border p-4 border-slate-200 bg-white"
            : "rounded-lg border p-4 border-slate-200 bg-slate-50";

          return (
            <a
              key={key}
              href={accessible ? config.href : undefined}
              className={className}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {config.label}
                </h2>
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
                {accessible
                  ? "Available to your role."
                  : "Not available to " + user.role}
              </p>
            </a>
          );
        })}
      </section>
    </div>
  );
}
