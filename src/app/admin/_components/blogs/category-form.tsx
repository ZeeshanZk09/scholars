"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type BlogCategoryFormData = {
  name: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type BlogCategoryFormProps = {
  mode: "create" | "edit";
  initial?: Partial<BlogCategoryFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function BlogCategoryForm({ mode, initial }: Readonly<BlogCategoryFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogCategoryFormData>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    status: initial?.status ?? "PUBLISHED",
  });

  function setField<K extends keyof BlogCategoryFormData>(
    key: K,
    value: BlogCategoryFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/blogs/categories/${initial?.id}`
          : "/api/v1/admin/blogs/categories",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save category");
      }

      toast.success(mode === "edit" ? "Category updated" : "Category created");
      router.push("/admin/blogs/categories");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save category",
      );
    } finally {
      setSaving(false);
    }
  }

  let buttonText = "Create Category";
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
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-900"
        >
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="e.g. Career Guidance"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-900"
        >
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={4}
          placeholder="Short description of this category"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

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
            setField("status", event.target.value as BlogCategoryFormData["status"])
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

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/blogs/categories"
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
