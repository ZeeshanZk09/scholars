import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SchoolService } from "@/services/academics";
import { ClassForm } from "../../../_components/school/class-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Class",
  robots: { index: false, follow: false },
};

export default async function EditSchoolClassPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/school/classes`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  const service = new SchoolService();

  const [schoolClass, levelsResult] = await Promise.all([
    service.getClassById(id).catch(() => null),
    service.listLevelsForAdmin({ skip: 0, take: 100 }),
  ]);

  if (!schoolClass) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/school/classes"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Classes
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Class</h1>
        <p className="mt-1 text-sm text-slate-600">{schoolClass.name}</p>
      </div>

      <ClassForm
        mode="edit"
        initial={{
          id: schoolClass.id,
          name: schoolClass.name,
          slug: schoolClass.slug,
          description: schoolClass.description ?? "",
          eligibility: schoolClass.eligibility ?? "",
          learningOutcomes: schoolClass.learningOutcomes ?? "",
          levelId: schoolClass.levelId,
          status: schoolClass.status,
          displayOrder: schoolClass.displayOrder,
        }}
        levels={levelsResult.items.map((level) => ({ id: level.id, name: level.name }))}
      />
    </div>
  );
}
