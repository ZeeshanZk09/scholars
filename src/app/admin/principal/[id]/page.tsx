import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PrincipalForm } from "../../_components/principal/principal-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { PrincipalService } from "@/services/principal";

export const metadata: Metadata = {
  title: "Edit Principal Message",
  robots: { index: false, follow: false },
};

export default async function EditPrincipalPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/principal`);
  }

  if (!hasPermission(user.role, PERMISSIONS.PRINCIPAL_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let message;

  try {
    message = await new PrincipalService().getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/principal"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Principal Message
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Principal Message</h1>
        <p className="mt-1 text-sm text-slate-600">{message.name}</p>
      </div>

      <PrincipalForm
        mode="edit"
        initial={{
          id: message.id,
          name: message.name,
          designation: message.designation ?? "",
          profileImageUrl: message.profileImageUrl ?? "",
          message: message.message,
          biography: message.biography ?? "",
          status: message.status,
          displayOrder: message.displayOrder,
        }}
      />
    </div>
  );
}
