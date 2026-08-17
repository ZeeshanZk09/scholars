"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdmissionInquirySchema,
  type CreateAdmissionInquiryInput,
} from "@/schemas/admission/admission.schema";

type AdmissionApplyFormProps = {
  periodId?: string;
};

export function AdmissionApplyForm({ periodId }: Readonly<AdmissionApplyFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdmissionInquiryInput>({
    resolver: zodResolver(createAdmissionInquirySchema),
    defaultValues: {
      studentName: "",
      parentGuardianName: "",
      phone: "",
      email: "",
      classOrCourse: "",
      interestedProgram: "",
      message: "",
      admissionPeriodId: periodId,
    },
  });

  async function onSubmit(values: CreateAdmissionInquiryInput) {
    try {
      const response = await fetch("/api/v1/admissions/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body?.error?.message ?? body?.message ?? "Failed to submit your application.";
        toast.error(message);
        return;
      }

      toast.success("Application submitted successfully!");
      reset({ admissionPeriodId: periodId });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="student-name">Student Name *</Label>
          <Input
            id="student-name"
            placeholder="Full name of the student"
            autoComplete="name"
            aria-invalid={Boolean(errors.studentName)}
            disabled={isSubmitting}
            {...register("studentName")}
          />
          {errors.studentName ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.studentName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="parent-name">Parent / Guardian Name</Label>
          <Input
            id="parent-name"
            placeholder="Full name of parent or guardian"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.parentGuardianName)}
            disabled={isSubmitting}
            {...register("parentGuardianName")}
          />
          {errors.parentGuardianName ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.parentGuardianName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="e.g. 0300 1234567"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            disabled={isSubmitting}
            {...register("phone")}
          />
          {errors.phone ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="class-course">Class / Course</Label>
          <Input
            id="class-course"
            placeholder="e.g. Class 9, FSc Pre-Medical, Web Development"
            aria-invalid={Boolean(errors.classOrCourse)}
            disabled={isSubmitting}
            {...register("classOrCourse")}
          />
          {errors.classOrCourse ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.classOrCourse.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="program">Interested Program</Label>
          <Input
            id="program"
            placeholder="e.g. Matric Science, ICS, Entry Test Prep"
            aria-invalid={Boolean(errors.interestedProgram)}
            disabled={isSubmitting}
            {...register("interestedProgram")}
          />
          {errors.interestedProgram ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.interestedProgram.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Any additional details about the application"
          aria-invalid={Boolean(errors.message)}
          disabled={isSubmitting}
          {...register("message")}
        />
        {errors.message ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
