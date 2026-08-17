"use client";

import { Sparkles, Type } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import RichTextEditor from "./RichTextEditor";

interface EditorMainProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly title: string;
  readonly onTitleChange: (title: string) => void;
  // blogId omitted — not used by editor UI
}

export default function EditorMain({
  content,
  onChange,
  title,
  onTitleChange,
}: EditorMainProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const isWorkPage = pathname.includes("/works");
  // Auto-resize title textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  // Extract word count from content
  const wordCount = (content || "")
    .replaceAll(/<[^<>]*>/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const titleLength = title.length;
  const titleLimit = 200;

  const getTitleColorClass = (length: number, limit: number) => {
    if (length > limit) return "text-red-500";
    if (length > limit - 20) return "text-amber-500";
    return "text-slate-400";
  };

  return (
    <div className="flex flex-col gap-6 ">
      {/* Title Input */}
      <div className="relative group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Type className="h-3.5 w-3.5" />
            {isWorkPage ? "Work" : "Blog"} Title{" "}
            <span className="text-red-500 dark:text-red-400">*</span>
          </div>
          <span
            className={`text-xs ${getTitleColorClass(titleLength, titleLimit)}`}
          >
            {titleLength}/{titleLimit}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= titleLimit) {
              onTitleChange(e.target.value);
            }
          }}
          placeholder="Enter your blog post title..."
          className="w-full bg-transparent border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-4xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/20 dark:focus:ring-slate-400/20 focus:border-slate-600 dark:focus:border-slate-500 resize-none transition-all overflow-hidden"
          rows={1}
        />
        <div className="absolute -left-10 top-14 opacity-0 group-hover:opacity-100 transition-opacity">
          <Sparkles className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="w-full">
        <RichTextEditor value={content} onChange={onChange} />
      </div>

      {/* Stats */}
      <div className="flex justify-end text-sm">
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold">{wordCount}</span> words
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold">{Math.ceil(wordCount / 200)}</span>{" "}
            min read
          </span>
        </div>
      </div>
    </div>
  );
}
