import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { NavigationService } from "@/services/navigation";
import { NavigationItemForm } from "../../../_components/navigation/navigation-item-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Edit Navigation Item",
  robots: { index: false, follow: false },
};

export default async function EditNavigationItemPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/navigation/items`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  const navigation = new NavigationService();
  let item;

  try {
    item = await navigation.getById(id);
  } catch {
    notFound();
  }

  const items = await navigation.listForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/navigation/items"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Navigation Items
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit Navigation Item</h1>
        <p className="mt-1 text-sm text-slate-600">{item.label}</p>
      </div>

      <NavigationItemForm
        mode="edit"
        currentId={item.id}
        parents={items.map((parent) => ({
          id: parent.id,
          label: parent.label,
          url: parent.url,
          position: parent.position ?? "main",
        }))}
        initial={{
          id: item.id,
          label: item.label,
          url: item.url,
          position: (item.position as "main" | "footer") ?? "main",
          parentId: item.parentId ?? "",
          displayOrder: item.displayOrder,
          status: item.status,
        }}
      />
    </div>
  );
}
