import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { NavigationService } from "@/services/navigation";
import { NavigationItemForm } from "../../../_components/navigation/navigation-item-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "New Navigation Item",
  robots: { index: false, follow: false },
};

export default async function NewNavigationItemPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/navigation/items`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
  }

  const items = await new NavigationService().listForAdmin();

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
        <h1 className="text-lg font-semibold text-slate-900">New Navigation Item</h1>
        <p className="mt-1 text-sm text-slate-600">Add a link to the main or footer navigation.</p>
      </div>

      <NavigationItemForm
        mode="create"
        parents={items.map((item) => ({
          id: item.id,
          label: item.label,
          url: item.url,
          position: item.position ?? "main",
        }))}
      />
    </div>
  );
}
