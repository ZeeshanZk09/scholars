"use client";

import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { TextSelection } from "@tiptap/pm/state";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { EditorToolbar, type LinkFormData } from "./EditorToolbar";
import {
  CustomHeading,
  CustomImage,
  FontSizeExtension,
  ParagraphFormattingExtension,
  LetterSpacingExtension,
} from "./extensions";

import {
  MAX_IMAGE_SIZE,
  calculateWordCount,
  slugify,
} from "@/lib/utilities/editor-utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  id?: string;
  onTextChange?: (text: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
  onTextChange,
  id,
}: Readonly<Props>) {
  const [wordCount, setWordCount] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState<LinkFormData>({ text: "", url: "" });
  const previousValueRef = useRef<string>(value || "");

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: { class: "list-disc pl-4 space-y-1 my-4" },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: { class: "list-decimal pl-4 space-y-1 my-4" },
        },
        heading: false,
        link: false,
        underline: false,
        codeBlock: {
          HTMLAttributes: {
            class:
              "rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-sm my-6 border border-slate-800 shadow-lg overflow-x-auto",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-muted-foreground/30 pl-4 py-1 my-4 italic text-muted-foreground bg-muted/30 rounded-r-lg",
          },
        },
      }),
      CustomHeading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: { class: "font-bold tracking-tight text-foreground" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontFamily,
      Color,
      Underline,
      Highlight.configure({
        HTMLAttributes: { class: "bg-yellow-200 text-yellow-900 rounded px-1" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      FontSizeExtension,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer font-medium",
        },
      }),
      CustomImage,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-border my-4 w-full",
        },
      }),
      TableRow.configure({
        HTMLAttributes: { class: "border border-border" },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "border border-border bg-muted/50 px-4 py-2 text-left font-bold text-foreground",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border px-4 py-2 text-foreground",
        },
      }),
      ParagraphFormattingExtension,
      LetterSpacingExtension,
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none min-h-[400px] px-6 focus:outline-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-p:text-foreground prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-li:text-foreground prose-a:text-primary prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-muted prose-blockquote:text-muted-foreground prose-code:text-foreground prose-code:bg-muted prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted prose-th:text-foreground prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-border prose-td:text-foreground prose-td:px-4 prose-td:py-2",
      },
    },
    onUpdate: ({ editor: editorInstance }) => {
      const html = editorInstance.getHTML();
      const cleanHtml = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ALLOWED_ATTR: [
          "href",
          "target",
          "rel",
          "src",
          "alt",
          "class",
          "style",
          "id",
          "data-toc-heading",
          "data-align",
          "data-width",
          "colspan",
          "rowspan",
          "scope",
          "data-type",
          "data-checked",
          "color",
          "type",
          "checked",
        ],
        ALLOWED_TAGS: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "br",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "strike",
          "s",
          "code",
          "pre",
          "ul",
          "ol",
          "li",
          "a",
          "img",
          "blockquote",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "div",
          "span",
          "mark",
        ],
        FORBID_TAGS: ["script", "object", "embed"],
        ALLOWED_URI_REGEXP:
          /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
      });

      previousValueRef.current = cleanHtml;
      onChange(cleanHtml);
      const text = editorInstance.getText();
      onTextChange?.(text);
      const words = calculateWordCount(text);
      setWordCount(words);
    },
  });

  useEffect(() => {
    if (!editor || value === undefined) return;
    if (value === previousValueRef.current) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml && value !== "<p></p>") {
      previousValueRef.current = value;
      setTimeout(() => {
        editor.commands.setContent(value);
      }, 0);
    }
  }, [value, editor]);

  const handleUploadImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            editor
              .chain()
              .focus()
              .setImage({
                src: dataUrl,
                alt: file.name.replace(/\.[^/.]+$/, ""),
              })
              .run();
            toast.success("Image added! It will be uploaded when you save.");
          }
        };
        reader.onerror = () => {
          toast.error("Failed to read image file");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    };
    input.click();
  }, [editor]);

  const isTocActive = useMemo(() => {
    if (!editor) return false;
    const node = editor.state.selection.$from.parent;
    if (!node) return false;
    return node.attrs.isTocHeading === true;
  }, [editor]);

  const handleToggleTocHeading = useCallback(() => {
    if (!editor) return;
    const node = editor.state.selection.$from.parent;
    if (!node) return;
    const nodeType = node.type.name;

    if (nodeType === "heading" || nodeType === "paragraph") {
      const currentIsToc = node.attrs.isTocHeading || false;
      editor
        .chain()
        .focus()
        .updateAttributes(nodeType, { isTocHeading: !currentIsToc })
        .run();
      if (!currentIsToc && node.textContent) {
        editor
          .chain()
          .focus()
          .updateAttributes(nodeType, { id: slugify(node.textContent) })
          .run();
      }
    } else {
      editor
        .chain()
        .focus()
        .setParagraph()
        .updateAttributes("paragraph", { isTocHeading: true })
        .run();
    }
  }, [editor]);

  const setHeadingWithToc = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      if (!editor) return;
      editor.chain().focus().toggleHeading({ level }).run();
      if (level === 1) {
        setTimeout(() => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.textContent) {
            editor
              .chain()
              .focus()
              .updateAttributes("heading", {
                isTocHeading: true,
                id: slugify(node.textContent),
              })
              .run();
          }
        }, 0);
      }
    },
    [editor],
  );

  const handleHeadingClick = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      if (!editor) return;
      const { from, to, empty } = editor.state.selection;

      if (!empty) {
        const $from = editor.state.doc.resolve(from);
        const $to = editor.state.doc.resolve(to);

        if ($from.sameParent($to)) {
          const blockStart = $from.start($from.depth);
          const blockEnd = $from.end($from.depth);
          const isPartial = from > blockStart || to < blockEnd;

          if (isPartial) {
            editor
              .chain()
              .focus()
              .command(({ tr }) => {
                if (to < blockEnd) tr.split(to);
                const mappedFrom = tr.mapping.map(from);
                const $mf = tr.doc.resolve(mappedFrom);
                if (mappedFrom > $mf.start($mf.depth)) tr.split(mappedFrom);
                const finalPos = tr.mapping.map(from, 1);
                const $fp = tr.doc.resolve(finalPos);
                tr.setSelection(
                  TextSelection.create(
                    tr.doc,
                    $fp.start($fp.depth),
                    $fp.end($fp.depth),
                  ),
                );
                return true;
              })
              .toggleHeading({ level })
              .run();

            if (level === 1) {
              setTimeout(() => {
                const node = editor.state.doc.nodeAt(
                  editor.state.selection.from,
                );
                if (node?.textContent) {
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("heading", {
                      isTocHeading: true,
                      id: slugify(node.textContent),
                    })
                    .run();
                }
              }, 0);
            }
            return;
          }
        }
      }

      if (level === 1) {
        setHeadingWithToc(1);
      } else {
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor, setHeadingWithToc],
  );

  const handleInsertTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const handleInsertLink = useCallback(
    (formData: LinkFormData) => {
      if (!editor) return false;
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;

      try {
        if (formData.text && !hasSelection) {
          editor
            .chain()
            .focus()
            .insertContent(
              `<a href="${formData.url}" target="_blank" rel="noopener noreferrer">${formData.text}</a> `,
            )
            .run();
        } else if (hasSelection) {
          editor
            .chain()
            .focus()
            .setLink({
              href: formData.url,
              target: "_blank",
              rel: "noopener noreferrer",
            })
            .run();
        } else {
          toast.error("Please select text or enter link text");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Failed to insert link:", error);
        toast.error("Failed to insert link");
        return false;
      }
    },
    [editor],
  );

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-100 rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Loading editor...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="min-w-full group relative flex flex-col rounded-2xl border-2 border-border bg-card h-162.5 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-md dark:shadow-none"
    >
      <EditorToolbar
        editor={editor}
        isTocActive={isTocActive}
        handleToggleTocHeading={handleToggleTocHeading}
        handleHeadingClick={handleHeadingClick}
        handleUploadImage={handleUploadImage}
        handleInsertTable={handleInsertTable}
        showLinkModal={showLinkModal}
        setShowLinkModal={setShowLinkModal}
        linkForm={linkForm}
        setLinkForm={setLinkForm}
        handleInsertLink={handleInsertLink}
      />

      <div className="flex-1 overflow-y-auto w-full rounded-b-3xl editor-content-wrapper py-6 mb-16">
        <EditorContent
          editor={editor}
          className="h-full min-w-full text-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex shrink-0 items-center justify-between rounded-b-xl border-t border-border bg-muted/30 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 rounded-full text-foreground shadow-sm">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autosaving...</span>
          </div>
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            {wordCount.toLocaleString()} words
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <svg
              className="w-3.5 h-3.5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            {(wordCount / 250).toFixed(1)} min read
          </span>
        </div>
      </div>
    </div>
  );
}
