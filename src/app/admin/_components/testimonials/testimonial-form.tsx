"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TestimonialFormData = {
  name: string;
  role: string;
  type: "STUDENT" | "PARENT" | "ALUMNI";
  message: string;
  imageUrl: string;
  rating: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type TestimonialFormProps = {
  mode: "create" | "edit";
  initial?: Partial<TestimonialFormData> & { id?: string };
};

const TYPE_OPTIONS = ["STUDENT", "PARENT", "ALUMNI"] as const;
const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function TestimonialForm({ mode, initial }: Readonly<TestimonialFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TestimonialFormData>({
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    type: initial?.type ?? "STUDENT",
    message: initial?.message ?? "",
    imageUrl: initial?.imageUrl ?? "",
    rating: initial?.rating ?? 5,
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof TestimonialFormData>(key: K, value: TestimonialFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.message.trim()) {
      toast.error("Message is required");
      return;
    }

    if (form.rating < 1 || form.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      name: form.name.trim(),
      role: form.role.trim() || undefined,
      message: form.message.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/testimonials/${initial?.id}`
          : "/api/v1/admin/testimonials",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save testimonial");
      }

      toast.success(mode === "edit" ? "Testimonial updated" : "Testimonial created");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  }

  let buttonText = "Create Testimonial";
  if (saving) {
    buttonText = "Saving...";
  } else if (mode === "edit") {
    buttonText = "Save Changes";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-900">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="e.g. Ahmed Raza"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-900">
            Role
          </label>
          <input
            id="role"
            type="text"
            value={form.role}
            onChange={(event) => setField("role", event.target.value)}
            placeholder="e.g. Student, Class 10"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-900">
            Type
          </label>
          <select
            id="type"
            value={form.type}
            onChange={(event) =>
              setField("type", event.target.value as TestimonialFormData["type"])
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-slate-900">
            Rating
          </label>
          <input
            id="rating"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(event) => setField("rating", Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-900">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
          rows={5}
          placeholder="What did the student, parent or alumni say?"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-900">
          Image URL
        </label>
        <input
          id="imageUrl"
          type="text"
          value={form.imageUrl}
          onChange={(event) => setField("imageUrl", event.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-900">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              setField("status", event.target.value as TestimonialFormData["status"])
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
          <label htmlFor="displayOrder" className="block text-sm font-medium text-slate-900">
            Display Order
          </label>
          <input
            id="displayOrder"
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(event) => setField("displayOrder", Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/testimonials"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
