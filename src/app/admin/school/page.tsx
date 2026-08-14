import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Layers, ListChecks, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SchoolService } from "@/services/academics";

export const metadata: Metadata = {
  title: "School",
  robots: { index: false, follow: false },
};

export default async function AdminSchoolPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/school`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const service = new SchoolService();
  const [levelsResult, classesResult] = await Promise.all([
    service.listLevelsForAdmin({ skip: 0, take: 1 }),
    service.listClassesForAdmin({ skip: 0, take: 1 }),
  ]);

  const sections = [
    {
      href: "/admin/school/levels",
      icon: Layers,
      title: "Academic Levels",
      description:
        "Organize the school into levels such as Nursery, Primary, Middle and Secondary.",
      count: levelsResult.total,
      cta: "Manage Levels",
    },
    {
      href: "/admin/school/classes",
      icon: ListChecks,
      title: "Classes",
      description:
        "Manage individual classes (Nursery, KG, Grade 1 to 10) with eligibility and learning outcomes.",
      count: classesResult.total,
      cta: "Manage Classes",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">School Module</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage school academic levels and classes shown on the public School page.
          </p>
        </div>
        <Link
          href="/admin/school/classes/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Class
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                <section.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-2xl font-bold text-slate-900">{section.count}</span>
            </div>
            <h2 className="mt-4 text-sm font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{section.description}</p>
            <span className="mt-3 inline-block text-sm font-medium text-slate-700">
              {section.cta} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}