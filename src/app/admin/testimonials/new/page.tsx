import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { TestimonialForm } from "../../_components/testimonials/testimonial-form";

export const metadata: Metadata = {
  title: "New Testimonial",
  robots: { index: false, follow: false },
};

export default async function NewTestimonialPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/testimonials/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.TESTIMONIAL_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/testimonials"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Testimonials
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Testimonial</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a review from a student, parent or alumnus to display on the website.
        </p>
      </div>

      <TestimonialForm mode="create" />
    </div>
  );
}