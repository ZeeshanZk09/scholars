import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ContactService } from "@/services/contact";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Contact Inquiries",
  robots: { index: false, follow: false },
};

export default async function AdminContactPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/contact`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const { total } = await new ContactService().listForAdmin({ skip: 0, take: 1 });
  const { total: newTotal } = await new ContactService().listForAdmin({
    skip: 0,
    take: 1,
    status: "NEW",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Contact Inquiries Module</h1>
        <p className="mt-1 text-sm text-slate-600">
          Messages submitted from the contact form on the public Contact page.
        </p>
      </div>

      <Link
        href="/admin/contact/messages"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">{total}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Messages</h2>
          {newTotal > 0 ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {newTotal} new
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Contact form messages from the public Contact page.
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Messages →
        </span>
      </Link>
    </div>
  );
}
