"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type NavigationItemFormData = {
  label: string;
  url: string;
  position: "main" | "footer";
  parentId: string;
  displayOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type NavigationItemFormProps = {
  mode: "create" | "edit";
  initial?: Partial<NavigationItemFormData> & { id?: string };
  parents: { id: string; label: string; url: string; position: string }[];
  currentId?: string;
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function NavigationItemForm({
  mode,
  initial,
  parents,
  currentId,
}: Readonly<NavigationItemFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NavigationItemFormData>({
    label: initial?.label ?? "",
    url: initial?.url ?? "",
    position: initial?.position ?? "main",
    parentId: initial?.parentId ?? "",
    displayOrder: initial?.displayOrder ?? 0,
    status: initial?.status ?? "PUBLISHED",
  });

  function setField<K extends keyof NavigationItemFormData>(
    key: K,
    value: NavigationItemFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.label.trim()) {
      toast.error("Label is required");
      return;
    }

    if (!form.url.trim()) {
      toast.error("URL is required");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      label: form.label.trim(),
      url: form.url.trim(),
      parentId: form.parentId || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/navigation/${initial?.id}`
          : "/api/v1/admin/navigation",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save navigation item");
      }

      toast.success(
        mode === "edit" ? "Navigation item updated" : "Navigation item created",
      );
      router.push("/admin/navigation");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save navigation item",
      );
    } finally {
      setSaving(false);
    }
  }

  const availableParents = parents.filter((parent) => parent.id !== currentId);

  let submitButtonLabel = "Create Item";
  if (saving) {
    submitButtonLabel = "Saving...";
  } else if (mode === "edit") {
    submitButtonLabel = "Save Changes";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="label"
            className="block text-sm font-medium text-slate-900"
          >
            Label <span className="text-red-600">*</span>
          </label>
          <input
            id="label"
            type="text"
            value={form.label}
            onChange={(event) => setField("label", event.target.value)}
            placeholder="e.g. Academics"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-slate-900"
          >
            URL <span className="text-red-600">*</span>
          </label>
          <input
            id="url"
            type="text"
            value={form.url}
            onChange={(event) => setField("url", event.target.value)}
            placeholder="e.g. /academics"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-slate-900"
          >
            Position
          </label>
          <select
            id="position"
            value={form.position}
            onChange={(event) =>
              setField(
                "position",
                event.target.value as NavigationItemFormData["position"],
              )
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="main">Main navigation</option>
            <option value="footer">Footer</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="parent"
            className="block text-sm font-medium text-slate-900"
          >
            Parent Item
          </label>
          <select
            id="parent"
            value={form.parentId}
            onChange={(event) => setField("parentId", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="">None (top level)</option>
            {availableParents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.label} ({parent.position})
              </option>
            ))}
          </select>
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
                event.target.value as NavigationItemFormData["status"],
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

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/navigation"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitButtonLabel}
        </button>
      </div>
    </form>
  );
}
