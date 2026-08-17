import { MessageSquareQuote, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { TestimonialService } from "@/services/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/testimonials`);
  }

  if (!hasPermission(user.role, PERMISSIONS.TESTIMONIAL_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.TESTIMONIAL_CREATE);
  const { total } = await new TestimonialService().listForAdmin({
    skip: 0,
    take: 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Testimonials Module
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage reviews and feedback from students, parents and alumni shown
            on the public website.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Testimonial
          </Link>
        ) : null}
      </div>

      <Link
        href="/admin/testimonials/list"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">{total}</span>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">
          Testimonials
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Testimonials with author, type, message, rating and display order.
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Testimonials →
        </span>
      </Link>
    </div>
  );
}
