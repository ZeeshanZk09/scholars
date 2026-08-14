"use client";

import { Link2, Image as ImageIcon, FileText, Search, Plus, X } from "lucide-react";
import CustomImage from "next/image";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface SidebarPostTabProps {
  readonly form: {
    slug: string;
    category: string;
    serviceId: string;
    author: string;
    tags?: number[];
    featuredImageUrl: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    authorSocial?: { [key: string]: string };
    customAuthor?: string;
  };
  readonly setField: (
    key: string,
    value: string | number | number[] | string[] | { [key: string]: string }
  ) => void;
  readonly onFeaturedImageChange: (file: File | null, previewUrl: string | null) => void;
  readonly categories: string[];
  readonly services: {
    serviceId: string;
    title: string;
  }[];
  readonly onAddCategory?: (name: string) => void;
}

export default function SidebarPostTab({
  form,
  setField,
  categories,
  services,
  onFeaturedImageChange,
  onAddCategory,
}: SidebarPostTabProps) {
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [showNewCategory, setShowNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");

  React.useEffect(() => {
    return () => {
      if (form.featuredImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(form.featuredImageUrl);
      }
    };
  }, [form.featuredImageUrl]);

  const getCharLimitColorClass = (length: number, limit: number) => {
    if (length > limit) return "text-red-500";
    if (length > limit - 50) return "text-amber-500";
    return "text-slate-500";
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setNewCategoryName("");
    setShowNewCategory(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* URL Slug */}
      <div className="space-y-2">
        <label className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Link2 className="h-3.5 w-3.5" />
            URL Slug <span className="text-red-500">*</span>
          </span>
          {slugEdited && (
            <span className="text-[10px] font-normal text-slate-600 normal-case">Custom</span>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setField("slug", e.target.value);
              setSlugEdited(true);
            }}
            placeholder="url-friendly-slug"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all font-mono"
          />
          {form.slug && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
              <span className="truncate">{form.slug}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="category"
            className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowNewCategory(!showNewCategory)}
            className="text-[10px] font-medium text-slate-600 hover:text-slate-700 flex items-center gap-1"
          >
            {showNewCategory ? (
              <>
                <X className="h-3 w-3" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" /> Add new
              </>
            )}
          </button>
        </div>

        {showNewCategory ? (
          <div className="relative">
            <input
              type="text"
              id="category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-16 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all text-black"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>
        ) : (
          <Select
            value={form.category}
            onValueChange={(val) => {
              if (val) {
                setField("category", val);
              }
            }}
          >
            <SelectTrigger className="w-full rounded-xl border-slate-300 bg-white px-3 py-5 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all h-10.5">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Services */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="service"
            className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
          >
            Services <span className="text-red-500">*</span>
          </label>
        </div>
        <Select
          value={form.serviceId}
          onValueChange={(val) => {
            if (val) {
              setField("serviceId", val);
            }
          }}
        >
          <SelectTrigger className="w-full rounded-xl border-slate-300 bg-white px-3 py-5 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all h-10.5">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((ser) => (
              <SelectItem key={ser.serviceId} value={ser.serviceId}>
                {ser.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Author (Text Field) */}
      <div className="space-y-2">
        <label
          htmlFor="customAuthor"
          className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
        >
          Author <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customAuthor"
          value={form.customAuthor || ""}
          onChange={(e) => setField("customAuthor", e.target.value)}
          placeholder="Enter author name"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all"
        />
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <ImageIcon className="h-3.5 w-3.5" />
          Featured Image <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          id="coverImageUpload"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (!file) return;
            if (form.featuredImageUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(form.featuredImageUrl);
            }
            const preview = URL.createObjectURL(file);
            onFeaturedImageChange(file, preview);
            setField("featuredImageUrl", preview);
          }}
        />

        {form.featuredImageUrl &&
        typeof form.featuredImageUrl === "string" &&
        form.featuredImageUrl.trim().length > 0 &&
        form.featuredImageUrl !== "null" ? (
          <div className="rounded-xl overflow-hidden border border-slate-100 aspect-video relative group">
            <CustomImage
              src={form.featuredImageUrl}
              alt="Preview"
              fill
              preload
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label
                htmlFor="coverImageUpload"
                className="bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full hover:bg-white/30 transition-colors font-semibold cursor-pointer"
              >
                Change Image
              </label>
              <button
                type="button"
                onClick={() => {
                  setField("coverImage", "");
                  onFeaturedImageChange(null, null);
                }}
                className="bg-red-500/60 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full hover:bg-red-500/80 transition-colors font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label
              htmlFor="coverImageUpload"
              className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all cursor-pointer group"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-slate-500", "bg-slate-100");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-slate-500", "bg-slate-100");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-slate-500", "bg-slate-100");
                const file = e.dataTransfer.files?.[0] || null;
                if (file?.type.startsWith("image/")) {
                  if (form.featuredImageUrl?.startsWith("blob:")) {
                    URL.revokeObjectURL(form.featuredImageUrl);
                  }
                  const preview = URL.createObjectURL(file);
                  onFeaturedImageChange(file, preview);
                  setField("coverImage", preview);
                }
              }}
            >
              <ImageIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Click to upload or drag & drop</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <input
              type="text"
              value={form.featuredImageUrl || ""}
              onChange={(e) => setField("featuredImageUrl", e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all"
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            Excerpt / Summary
          </span>
          <span
            className={`text-[10px] font-normal ${getCharLimitColorClass(form.excerpt.length, 280)}`}
          >
            {form.excerpt.length}/280
          </span>
        </label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setField("excerpt", e.target.value)}
          rows={4}
          maxLength={280}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all resize-none"
          placeholder="Write a brief summary for this post (max 280 characters)..."
        />
      </div>

      <hr className="border-slate-100" />

      {/* SEO Section (Collapsible) */}
      <details className="group pt-2">
        <summary className="flex items-center justify-between cursor-pointer list-none py-2">
          <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest">
            <Search className="h-4 w-4 text-slate-500 group-open:text-slate-600 transition-colors" />
            SEO Optimization
          </h4>
          <span className="mr-2 transition-transform group-open:rotate-180 text-slate-500">▼</span>
        </summary>

        <div className="space-y-4 pt-4 animate-fade-in-down">
          <div className="space-y-2">
            <label
              htmlFor="meta-title"
              className="text-[11px] font-semibold text-slate-500 uppercase tracking-tighter flex items-center justify-between"
            >
              <span>Meta Title</span>
              <span
                className={`text-[10px] font-normal ${getCharLimitColorClass(form.metaTitle.length, 200)}`}
              >
                {form.metaTitle.length}/200
              </span>
            </label>
            <input
              type="text"
              id="meta-title"
              value={form.metaTitle}
              onChange={(e) => setField("metaTitle", e.target.value)}
              maxLength={200}
              placeholder="SEO-optimized title"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="meta-description"
              className="text-[11px] font-semibold text-slate-500 uppercase tracking-tighter flex items-center justify-between"
            >
              <span>Meta Description</span>
              <span
                className={`text-[10px] font-normal ${getCharLimitColorClass(form.metaDescription.length, 500)}`}
              >
                {form.metaDescription.length}/500
              </span>
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setField("metaDescription", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Brief description for search results"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="meta-keywords"
              className="text-[11px] font-semibold text-slate-500 uppercase tracking-tighter flex items-center justify-between"
            >
              <span>Keywords</span>
              <span
                className={`text-[10px] font-normal ${getCharLimitColorClass(form.keywords.length, 500)}`}
              >
                {form.keywords.length}/500
              </span>
            </label>
            <input
              type="text"
              id="meta-keywords"
              value={form.keywords}
              onChange={(e) => setField("keywords", e.target.value)}
              maxLength={500}
              placeholder="admissions, school, college (comma separated)"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all"
            />
          </div>
        </div>
      </details>

      <hr className="border-slate-100" />
    </div>
  );
}
