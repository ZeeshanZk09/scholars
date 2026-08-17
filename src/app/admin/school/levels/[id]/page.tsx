import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { type User } from "next-auth";

import { LevelForm } from "../../../_components/school/level-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SchoolService } from "@/services/academics";

export const metadata: Metadata = {
  title: "Edit Academic Level",
  robots: { index: false, follow: false },
};

export default async function EditAcademicLevelPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/school/levels`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let level;

  try {
    level = await new SchoolService().getLevelById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/school/levels"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Levels
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">
          Edit Academic Level
        </h1>
        <p className="mt-1 text-sm text-slate-600">{level.name}</p>
      </div>

      <LevelForm
        mode="edit"
        initial={{
          id: level.id,
          name: level.name,
          slug: level.slug,
          description: level.description ?? "",
          status: level.status,
          displayOrder: level.displayOrder,
        }}
      />
    </div>
  );
}
