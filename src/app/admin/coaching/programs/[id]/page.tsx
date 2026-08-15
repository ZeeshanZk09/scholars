import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { CoachingProgramService } from "@/services/coaching";
import { CoachingProgramForm } from "../../../_components/coaching/coaching-program-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Coaching Program",
  robots: { index: false, follow: false },
};

export default async function EditCoachingProgramPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/coaching/programs`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let program;

  try {
    program = await new CoachingProgramService().getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/coaching/programs"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Programs
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Program</h1>
        <p className="mt-1 text-sm text-slate-600">{program.name}</p>
      </div>

      <CoachingProgramForm
        mode="edit"
        initial={{
          id: program.id,
          name: program.name,
          slug: program.slug,
          category: program.category ?? "",
          description: program.description ?? "",
          targetStudents: program.targetStudents ?? "",
          subjects: program.subjects ?? "",
          duration: program.duration ?? "",
          timing: program.timing ?? "",
          feeInformation: program.feeInformation ?? "",
          admissionStatus: program.admissionStatus ?? "",
          status: program.status,
          displayOrder: program.displayOrder,
        }}
      />
    </div>
  );
}
