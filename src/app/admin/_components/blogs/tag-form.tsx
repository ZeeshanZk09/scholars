"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type BlogTagFormData = {
  name: string;
};

type BlogTagFormProps = {
  mode: "create" | "edit";
  initial?: Partial<BlogTagFormData> & { id?: string };
};

export function BlogTagForm({ mode, initial }: Readonly<BlogTagFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogTagFormData>({
    name: initial?.name ?? "",
  });

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    const body = { name: form.name.trim() };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/blogs/tags/${initial?.id}`
          : "/api/v1/admin/blogs/tags",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save tag");
      }

      toast.success(mode === "edit" ? "Tag updated" : "Tag created");
      router.push("/admin/blogs/tags");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save tag");
    } finally {
      setSaving(false);
    }
  }

  let buttonText = "Create Tag";
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
          onChange={(event) => setForm({ name: event.target.value })}
          placeholder="e.g. Exam Preparation"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/blogs/tags"
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
