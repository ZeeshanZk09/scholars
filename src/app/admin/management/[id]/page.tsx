import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ManagementForm } from "../../_components/management/management-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ManagementService } from "@/services/management";

export const metadata: Metadata = {
  title: "Edit Management Member",
  robots: { index: false, follow: false },
};

export default async function EditManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/management`);
  }

  if (!hasPermission(user.role, PERMISSIONS.MANAGEMENT_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let member;

  try {
    member = await new ManagementService().getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/management"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Management
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">
          Edit Management Member
        </h1>
        <p className="mt-1 text-sm text-slate-600">{member.name}</p>
      </div>

      <ManagementForm
        mode="edit"
        initial={{
          id: member.id,
          name: member.name,
          designation: member.designation ?? "",
          imageUrl: member.imageUrl ?? "",
          biography: member.biography ?? "",
          status: member.status,
          displayOrder: member.displayOrder,
        }}
      />
    </div>
  );
}
