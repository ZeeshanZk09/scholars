"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type PageFormData = {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  layout: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
};

type PageFormProps = {
  mode: "create" | "edit";
  initial?: Partial<PageFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

function toDateTimeLocal(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function PageForm({ mode, initial }: Readonly<PageFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PageFormData>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    content: initial?.content ?? "",
    featuredImage: initial?.featuredImage ?? "",
    layout: initial?.layout ?? "",
    status: initial?.status ?? "DRAFT",
    publishedAt: toDateTimeLocal(initial?.publishedAt),
    seoTitle: initial?.seoTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    canonicalUrl: initial?.canonicalUrl ?? "",
    ogTitle: initial?.ogTitle ?? "",
    ogDescription: initial?.ogDescription ?? "",
    ogImage: initial?.ogImage ?? "",
    robots: initial?.robots ?? "",
  });

  function setField<K extends keyof PageFormData>(
    key: K,
    value: PageFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    const body = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      content: form.content.trim() || undefined,
      featuredImage: form.featuredImage.trim() || undefined,
      layout: form.layout.trim() || undefined,
      status: form.status,
      publishedAt: form.publishedAt
        ? new Date(form.publishedAt).toISOString()
        : undefined,
      seo: {
        seoTitle: form.seoTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        canonicalUrl: form.canonicalUrl.trim() || undefined,
        ogTitle: form.ogTitle.trim() || undefined,
        ogDescription: form.ogDescription.trim() || undefined,
        ogImage: form.ogImage.trim() || undefined,
        robots: form.robots.trim() || undefined,
      },
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/pages/${initial?.id}`
          : "/api/v1/admin/pages",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save page");
      }

      toast.success(mode === "edit" ? "Page updated" : "Page created");
      router.push("/admin/pages");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save page",
      );
    } finally {
      setSaving(false);
    }
  }

  const actionText = mode === "edit" ? "Save Changes" : "Create Page";
  const submitButtonText = saving ? "Saving..." : actionText;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-8 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-900"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(event) => setField("title", event.target.value)}
              placeholder="e.g. About Us"
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
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate-900"
          >
            Content
          </label>
          <textarea
            id="content"
            value={form.content}
            onChange={(event) => setField("content", event.target.value)}
            rows={8}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="featuredImage"
              className="block text-sm font-medium text-slate-900"
            >
              Featured Image URL
            </label>
            <input
              id="featuredImage"
              type="text"
              value={form.featuredImage}
              onChange={(event) =>
                setField("featuredImage", event.target.value)
              }
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label
              htmlFor="layout"
              className="block text-sm font-medium text-slate-900"
            >
              Layout
            </label>
            <input
              id="layout"
              type="text"
              value={form.layout}
              onChange={(event) => setField("layout", event.target.value)}
              placeholder="e.g. default"
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
                setField("status", event.target.value as PageFormData["status"])
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
              htmlFor="publishedAt"
              className="block text-sm font-medium text-slate-900"
            >
              Publish Date
            </label>
            <input
              id="publishedAt"
              type="datetime-local"
              value={form.publishedAt}
              onChange={(event) => setField("publishedAt", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">SEO</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Search engine and social sharing metadata for this page.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="seoTitle"
              className="block text-sm font-medium text-slate-900"
            >
              SEO Title
            </label>
            <input
              id="seoTitle"
              type="text"
              value={form.seoTitle}
              onChange={(event) => setField("seoTitle", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label
              htmlFor="robots"
              className="block text-sm font-medium text-slate-900"
            >
              Robots
            </label>
            <input
              id="robots"
              type="text"
              value={form.robots}
              onChange={(event) => setField("robots", event.target.value)}
              placeholder="e.g. index, follow"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-slate-900"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={form.metaDescription}
            onChange={(event) =>
              setField("metaDescription", event.target.value)
            }
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="canonicalUrl"
            className="block text-sm font-medium text-slate-900"
          >
            Canonical URL
          </label>
          <input
            id="canonicalUrl"
            type="text"
            value={form.canonicalUrl}
            onChange={(event) => setField("canonicalUrl", event.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ogTitle"
              className="block text-sm font-medium text-slate-900"
            >
              Open Graph Title
            </label>
            <input
              id="ogTitle"
              type="text"
              value={form.ogTitle}
              onChange={(event) => setField("ogTitle", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label
              htmlFor="ogImage"
              className="block text-sm font-medium text-slate-900"
            >
              Open Graph Image URL
            </label>
            <input
              id="ogImage"
              type="text"
              value={form.ogImage}
              onChange={(event) => setField("ogImage", event.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="ogDescription"
            className="block text-sm font-medium text-slate-900"
          >
            Open Graph Description
          </label>
          <textarea
            id="ogDescription"
            value={form.ogDescription}
            onChange={(event) => setField("ogDescription", event.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/pages"
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
