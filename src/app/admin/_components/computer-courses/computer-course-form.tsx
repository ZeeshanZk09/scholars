"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ComputerCourseFormData = {
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  duration: string;
  eligibility: string;
  courseOutline: string;
  instructor: string;
  timing: string;
  fee: string;
  admissionStatus: string;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type ComputerCourseFormProps = {
  mode: "create" | "edit";
  initial?: Partial<ComputerCourseFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function ComputerCourseForm({
  mode,
  initial,
}: Readonly<ComputerCourseFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ComputerCourseFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    shortDescription: initial?.shortDescription ?? "",
    detailedDescription: initial?.detailedDescription ?? "",
    duration: initial?.duration ?? "",
    eligibility: initial?.eligibility ?? "",
    courseOutline: initial?.courseOutline ?? "",
    instructor: initial?.instructor ?? "",
    timing: initial?.timing ?? "",
    fee: initial?.fee ?? "",
    admissionStatus: initial?.admissionStatus ?? "",
    isFeatured: initial?.isFeatured ?? false,
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof ComputerCourseFormData>(
    key: K,
    value: ComputerCourseFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.courseOutline.trim()) {
      toast.error("Course outline is required");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      shortDescription: form.shortDescription.trim() || undefined,
      detailedDescription: form.detailedDescription.trim() || undefined,
      duration: form.duration.trim() || undefined,
      eligibility: form.eligibility.trim() || undefined,
      courseOutline: form.courseOutline.trim(),
      instructor: form.instructor.trim() || undefined,
      timing: form.timing.trim() || undefined,
      fee: form.fee.trim() || undefined,
      admissionStatus: form.admissionStatus.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/computer-courses/${initial?.id}`
          : "/api/v1/admin/computer-courses",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save computer course");
      }

      toast.success(mode === "edit" ? "Course updated" : "Course created");
      router.push("/admin/computer-courses");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save computer course",
      );
    } finally {
      setSaving(false);
    }
  }

  let submitButtonText = "Create Course";
  if (saving) {
    submitButtonText = "Saving...";
  } else if (mode === "edit") {
    submitButtonText = "Save Changes";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-900"
        >
          Course Title <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="e.g. Web Development"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-slate-900"
        >
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={form.slug}
          onChange={(event) => setField("slug", event.target.value)}
          placeholder="auto-generated"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="shortDescription"
          className="block text-sm font-medium text-slate-900"
        >
          Short Description
        </label>
        <input
          id="shortDescription"
          type="text"
          value={form.shortDescription}
          onChange={(event) => setField("shortDescription", event.target.value)}
          placeholder="One-line summary shown on course cards"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="detailedDescription"
          className="block text-sm font-medium text-slate-900"
        >
          Detailed Description
        </label>
        <textarea
          id="detailedDescription"
          value={form.detailedDescription}
          onChange={(event) =>
            setField("detailedDescription", event.target.value)
          }
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="courseOutline"
          className="block text-sm font-medium text-slate-900"
        >
          Course Outline <span className="text-red-600">*</span>
        </label>
        <textarea
          id="courseOutline"
          value={form.courseOutline}
          onChange={(event) => setField("courseOutline", event.target.value)}
          rows={5}
          placeholder="Topics covered in the course"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-slate-900"
          >
            Duration
          </label>
          <input
            id="duration"
            type="text"
            value={form.duration}
            onChange={(event) => setField("duration", event.target.value)}
            placeholder="e.g. 6 Months"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="eligibility"
            className="block text-sm font-medium text-slate-900"
          >
            Eligibility
          </label>
          <input
            id="eligibility"
            type="text"
            value={form.eligibility}
            onChange={(event) => setField("eligibility", event.target.value)}
            placeholder="e.g. No prior experience required"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="instructor"
            className="block text-sm font-medium text-slate-900"
          >
            Instructor
          </label>
          <input
            id="instructor"
            type="text"
            value={form.instructor}
            onChange={(event) => setField("instructor", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="timing"
            className="block text-sm font-medium text-slate-900"
          >
            Schedule / Timings
          </label>
          <input
            id="timing"
            type="text"
            value={form.timing}
            onChange={(event) => setField("timing", event.target.value)}
            placeholder="e.g. Evening 5:00 PM – 7:00 PM"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fee"
            className="block text-sm font-medium text-slate-900"
          >
            Fee
          </label>
          <input
            id="fee"
            type="text"
            value={form.fee}
            onChange={(event) => setField("fee", event.target.value)}
            placeholder="e.g. PKR 15,000"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="admissionStatus"
            className="block text-sm font-medium text-slate-900"
          >
            Admission Status
          </label>
          <input
            id="admissionStatus"
            type="text"
            value={form.admissionStatus}
            onChange={(event) =>
              setField("admissionStatus", event.target.value)
            }
            placeholder="e.g. Open / Limited Seats"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-900"
          >
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              setField(
                "status",
                event.target.value as ComputerCourseFormData["status"],
              )
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="displayOrder"
            className="block text-sm font-medium text-slate-900"
          >
            Display Order
          </label>
          <input
            id="displayOrder"
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(event) =>
              setField("displayOrder", Number(event.target.value))
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <Label className="flex items-center gap-2 text-sm font-medium text-slate-900">
        <Input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(event) => setField("isFeatured", event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Featured course (highlighted on the site)
      </Label>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/computer-courses"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}
