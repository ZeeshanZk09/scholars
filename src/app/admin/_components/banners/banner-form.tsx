"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type BannerFormData = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  ctaLabel: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type BannerFormProps = {
  mode: "create" | "edit";
  initial?: Partial<BannerFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function BannerForm({ mode, initial }: BannerFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BannerFormData>({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    linkUrl: initial?.linkUrl ?? "",
    ctaLabel: initial?.ctaLabel ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.imageUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim(),
      linkUrl: form.linkUrl.trim() || undefined,
      ctaLabel: form.ctaLabel.trim() || undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/banners/${initial?.id}`
          : "/api/v1/admin/banners",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save banner");
      }

      toast.success(mode === "edit" ? "Banner updated" : "Banner created");
      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save banner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-900">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(event) => setField("title", event.target.value)}
          placeholder="e.g. Summer Admission Open"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-slate-900">
          Subtitle
        </label>
        <input
          id="subtitle"
          type="text"
          value={form.subtitle}
          onChange={(event) => setField("subtitle", event.target.value)}
          placeholder="Short line shown under the title"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-900">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={4}
          placeholder="Optional details shown on the banner"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-900">
          Image URL <span className="text-red-600">*</span>
        </label>
        <input
          id="imageUrl"
          type="text"
          value={form.imageUrl}
          onChange={(event) => setField("imageUrl", event.target.value)}
          placeholder="https://example.com/banner.jpg"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ctaLabel" className="block text-sm font-medium text-slate-900">
            CTA Label
          </label>
          <input
            id="ctaLabel"
            type="text"
            value={form.ctaLabel}
            onChange={(event) => setField("ctaLabel", event.target.value)}
            placeholder="e.g. Apply Now"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label htmlFor="linkUrl" className="block text-sm font-medium text-slate-900">
            CTA URL
          </label>
          <input
            id="linkUrl"
            type="text"
            value={form.linkUrl}
            onChange={(event) => setField("linkUrl", event.target.value)}
            placeholder="https://example.com/admissions"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-900">
            Start Date
          </label>
          <input
            id="startDate"
            type="datetime-local"
            value={form.startDate}
            onChange={(event) => setField("startDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Banner is hidden before this date. Leave empty to always show.
          </p>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-900">
            End Date
          </label>
          <input
            id="endDate"
            type="datetime-local"
            value={form.endDate}
            onChange={(event) => setField("endDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Banner expires after this date. Leave empty to never expire.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-900">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) => setField("status", event.target.value as BannerFormData["status"])}
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
          href="/admin/banners"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Banner"}
        </button>
      </div>
    </form>
  );
}
