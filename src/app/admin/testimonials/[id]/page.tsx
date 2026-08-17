import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { TestimonialForm } from "../../_components/testimonials/testimonial-form";

import type { Metadata } from "next";
import type { User } from "next-auth";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { TestimonialService } from "@/services/testimonials";

export const metadata: Metadata = {
  title: "Edit Testimonial",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/testimonials`);
  }

  if (!hasPermission(user.role, PERMISSIONS.TESTIMONIAL_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let testimonial;

  try {
    testimonial = await new TestimonialService().getById(id);
  } catch {
    notFound();
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
        <h1 className="text-lg font-semibold text-slate-900">Edit Testimonial</h1>
        <p className="mt-1 text-sm text-slate-600">{testimonial.name}</p>
      </div>

      <TestimonialForm
        mode="edit"
        initial={{
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role ?? "",
          type: testimonial.type,
          message: testimonial.message,
          imageUrl: testimonial.imageUrl ?? "",
          rating: testimonial.rating,
          status: testimonial.status,
          displayOrder: testimonial.displayOrder,
        }}
      />
    </div>
  );
}
