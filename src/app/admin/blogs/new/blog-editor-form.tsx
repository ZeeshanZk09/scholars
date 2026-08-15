"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SidebarPostTab from "../../_components/editor/SidebarPost";
import EditorMain from "../../_components/editor/EditorMain";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type PostForm = {
  slug: string;
  category: string;
  serviceId: string;
  author: string;
  tags: number[];
  featuredImageUrl: string;
  coverImage: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  authorSocial: Record<string, string>;
  customAuthor: string;
};

type BlogEditorFormProps = {
  readonly authorName: string;
  readonly categories: string[];
  readonly services: { serviceId: string; title: string }[];
  readonly mode?: "create" | "edit";
  readonly id?: string;
  readonly initial?: {
    title?: string;
    content?: string;
    slug?: string;
    excerpt?: string;
    featuredImage?: string;
    categoryName?: string;
    status?: string;
    seoTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
};

export function BlogEditorForm({
  authorName,
  categories,
  services,
  mode = "create",
  id,
  initial,
}: BlogEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [status, setStatus] = useState(initial?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PostForm>({
    slug: initial?.slug ?? "",
    category: initial?.categoryName ?? "",
    serviceId: "",
    author: authorName,
    tags: [],
    featuredImageUrl: initial?.featuredImage ?? "",
    coverImage: "",
    excerpt: initial?.excerpt ?? "",
    metaTitle: initial?.seoTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    keywords: initial?.keywords ?? "",
    authorSocial: {},
    customAuthor: authorName,
  });

  function setField(
    key: string,
    value: string | number | number[] | string[] | Record<string, string>
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFeaturedImageChange(_file: File | null, previewUrl: string | null) {
    setField("featuredImageUrl", previewUrl ?? "");
  }

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Post content is required");
      return;
    }

    setSaving(true);

    const isEdit = mode === "edit" && id;

    const seo = {
      seoTitle: form.metaTitle.trim() || undefined,
      metaDescription: form.metaDescription.trim() || undefined,
      keywords: form.keywords.trim() || undefined,
    };

    try {
      const response = await fetch(isEdit ? `/api/v1/admin/blogs/${id}` : "/api/v1/admin/blogs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: form.slug || undefined,
          excerpt: form.excerpt || undefined,
          content,
          featuredImage: form.featuredImageUrl || undefined,
          status,
          categoryName: form.category || undefined,
          seo,
        }),
      });

      if (response.status === 401) {
        router.push("/auth/login?callbackUrl=/admin/blogs");
        return;
      }

      if (response.status === 403) {
        router.push("/admin/unauthorized");
        return;
      }

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const message = body?.error?.message ?? body?.message ?? "Failed to save the post.";
        toast.error(message);
        return;
      }

      toast.success(isEdit ? "Post updated successfully." : "Post saved as a draft.");
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      toast.error("Failed to save the post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  let submitButtonText = "Save Draft";
  if (saving) {
    submitButtonText = "Saving...";
  } else if (mode === "edit") {
    submitButtonText = "Update Post";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {mode === "edit" ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">Draft content using the rich text editor.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Status
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {submitButtonText}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6">
          <EditorMain
            title={title}
            onTitleChange={setTitle}
            content={content}
            onChange={setContent}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <SidebarPostTab
            form={form}
            setField={setField}
            categories={categories}
            services={services}
            onFeaturedImageChange={handleFeaturedImageChange}
          />
        </div>
      </div>
    </div>
  );
}
