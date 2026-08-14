"use client";

import { Extension, mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, type NodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import DOMPurify from "dompurify";
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { slugify } from "@/lib/utilities/editor-utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paragraphFormatting: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
      setSpaceBefore: (space: string) => ReturnType;
      unsetSpaceBefore: () => ReturnType;
      setSpaceAfter: (space: string) => ReturnType;
      unsetSpaceAfter: () => ReturnType;
      toggleKeepWithNext: () => ReturnType;
      toggleKeepLinesTogether: () => ReturnType;
      togglePreventSingleLines: () => ReturnType;
      togglePageBreakBefore: () => ReturnType;
    };
  }
}

function getImageAlignStyles(align: string | null | undefined): {
  alignClass: string;
  justifyContent: "flex-start" | "flex-end" | "center";
} {
  if (align === "left") {
    return { alignClass: "mr-auto", justifyContent: "flex-start" };
  }
  if (align === "right") {
    return { alignClass: "ml-auto", justifyContent: "flex-end" };
  }
  return { alignClass: "mx-auto", justifyContent: "center" };
}

// Custom Image Node View
function ImageNodeView({ node, updateAttributes, deleteNode }: Readonly<NodeViewProps>) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = useCallback(() => {
    if (deleteNode && typeof deleteNode === "function") {
      deleteNode();
    }
  }, [deleteNode]);

  const { alignClass, justifyContent } = getImageAlignStyles(node.attrs.align);

  return (
    <NodeViewWrapper
      className="relative my-8 flex group w-full"
      style={{ justifyContent }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${alignClass}`} style={{ width: "50%" }}>
        <NextImage
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          width={800}
          height={800}
          className="rounded-2xl border border-slate-200 shadow-lg max-w-full h-auto w-full object-contain"
          preload
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        {isHovered && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 p-1 rounded-lg border border-slate-200 shadow-lg z-10 transition-all duration-200">
            <button
              type="button"
              onClick={() => updateAttributes({ align: "left" })}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ align: "center" })}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ align: "right" })}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
              title="Delete image"
              aria-label="Delete image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

// Custom Image Extension
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        renderHTML: (attributes) => ({ "data-align": attributes.align }),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { "data-align": align, style: incomingStyle, ...rest } = HTMLAttributes;

    let style = incomingStyle || "";
    style += `width: 50%; `;

    if (align === "left") {
      style += "margin-right: auto; margin-left: 0; display: block; ";
    } else if (align === "right") {
      style += "margin-left: auto; margin-right: 0; display: block; ";
    } else {
      style += "margin-left: auto; margin-right: auto; display: block; ";
    }

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, rest, { style, "data-align": align }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (attributes.id) {
            return { id: attributes.id };
          }
          return {};
        },
      },
      isTocHeading: {
        default: false,
        parseHTML: (element) => {
          const tagName = element.tagName.toLowerCase();
          // H1, H2, and H3 are always TOC headings, others only if they have id
          if (tagName === "h1" || tagName === "h2" || tagName === "h3") return true;
          return element.hasAttribute("id") || false;
        },
        renderHTML: (attributes) => {
          if (attributes.isTocHeading) {
            return { "data-toc-heading": "true" };
          }
          return {};
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    // Generate ID if not present
    if (!HTMLAttributes.id && node.textContent) {
      HTMLAttributes.id = slugify(node.textContent);
    }

    // Auto-mark H1, H2, and H3 as TOC heading
    if (level === 1 || level === 2 || level === 3) {
      HTMLAttributes["data-toc-heading"] = "true";
    }

    // Add font size styles
    const fontSizes = {
      1: "2.25rem", // 36px
      2: "1.875rem", // 30px
      3: "1.5rem", // 24px
      4: "1.25rem", // 20px
      5: "1.125rem", // 18px
      6: "1rem", // 16px
    };

    HTMLAttributes.style = HTMLAttributes.style || "";
    HTMLAttributes.style += `font-size: ${fontSizes[level as keyof typeof fontSizes]}; font-weight: bold;`;

    return [`h${level}`, HTMLAttributes, 0];
  },
});

export const FontSizeExtension = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

export const ParagraphFormattingExtension = Extension.create({
  name: "paragraphFormatting",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "listItem"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
          marginTop: {
            default: "",
            parseHTML: (element) => element.style.marginTop || "",
            renderHTML: (attributes) => {
              if (!attributes.marginTop) return {};
              return { style: `margin-top: ${attributes.marginTop}` };
            },
          },
          marginBottom: {
            default: "",
            parseHTML: (element) => element.style.marginBottom || "",
            renderHTML: (attributes) => {
              if (!attributes.marginBottom) return {};
              return { style: `margin-bottom: ${attributes.marginBottom}` };
            },
          },
          keepWithNext: {
            default: false,
            parseHTML: (element) => element.style.breakAfter === "avoid",
            renderHTML: (attributes) => {
              if (!attributes.keepWithNext) return {};
              return { style: `break-after: avoid; page-break-after: avoid;` };
            },
          },
          keepLinesTogether: {
            default: false,
            parseHTML: (element) => element.style.breakInside === "avoid",
            renderHTML: (attributes) => {
              if (!attributes.keepLinesTogether) return {};
              return { style: `break-inside: avoid; page-break-inside: avoid;` };
            },
          },
          preventSingleLines: {
            default: true,
            parseHTML: (element) => element.style.orphans !== "1",
            renderHTML: (attributes) => {
              if (attributes.preventSingleLines === false) {
                return { style: "orphans: 1; widows: 1;" };
              }
              // if true, we can set orphans: 2, widows: 2, though it's often default
              return { style: `orphans: 2; widows: 2;` };
            },
          },
          pageBreakBefore: {
            default: false,
            parseHTML: (element) => element.style.breakBefore === "page",
            renderHTML: (attributes) => {
              if (!attributes.pageBreakBefore) return {};
              return { style: `break-before: page; page-break-before: always;` };
            },
          },
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("id"),
            renderHTML: (attributes) => {
              if (attributes.id) {
                return { id: attributes.id };
              }
              return {};
            },
          },
          isTocHeading: {
            default: false,
            parseHTML: (element) => Object.hasOwn(element.dataset, "tocHeading"),
            renderHTML: (attributes) => {
              if (attributes.isTocHeading) {
                return { "data-toc-heading": "true" };
              }
              return {};
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({
          commands,
        }: {
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          return (
            commands.updateAttributes("paragraph", { lineHeight }) ||
            commands.updateAttributes("heading", { lineHeight }) ||
            commands.updateAttributes("listItem", { lineHeight })
          );
        },
      unsetLineHeight:
        () =>
        ({
          commands,
        }: {
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight: string | null;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          return (
            commands.updateAttributes("paragraph", { lineHeight: null }) ||
            commands.updateAttributes("heading", { lineHeight: null }) ||
            commands.updateAttributes("listItem", { lineHeight: null })
          );
        },
      setSpaceBefore:
        (marginTop: string) =>
        ({
          commands,
        }: {
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          return (
            commands.updateAttributes("paragraph", { marginTop }) ||
            commands.updateAttributes("heading", { marginTop })
          );
        },
      unsetSpaceBefore:
        () =>
        ({
          commands,
        }: {
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          return (
            commands.updateAttributes("paragraph", { marginTop: "" }) ||
            commands.updateAttributes("heading", { marginTop: "" })
          );
        },
      setSpaceAfter:
        (marginBottom: string) =>
        ({
          commands,
        }: {
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          return (
            commands.updateAttributes("paragraph", { marginBottom }) ||
            commands.updateAttributes("heading", { marginBottom })
          );
        },
      unsetSpaceAfter:
        () =>
        ({
          commands,
        }: {
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          return (
            commands.updateAttributes("paragraph", { marginBottom: "" }) ||
            commands.updateAttributes("heading", { marginBottom: "" })
          );
        },
      toggleKeepWithNext:
        () =>
        ({
          editor,
          commands,
        }: {
          editor: {
            isActive: (attributes: { keepWithNext: boolean }) => boolean;
          };
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          const isActive = editor.isActive({ keepWithNext: true });
          return (
            commands.updateAttributes("paragraph", { keepWithNext: !isActive }) ||
            commands.updateAttributes("heading", { keepWithNext: !isActive })
          );
        },
      toggleKeepLinesTogether:
        () =>
        ({
          editor,
          commands,
        }: {
          editor: {
            isActive: (attributes: { keepLinesTogether: boolean }) => boolean;
          };
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          const isActive = editor.isActive({ keepLinesTogether: true });
          return (
            commands.updateAttributes("paragraph", { keepLinesTogether: !isActive }) ||
            commands.updateAttributes("heading", { keepLinesTogether: !isActive })
          );
        },
      togglePreventSingleLines:
        () =>
        ({
          editor,
          commands,
        }: {
          editor: {
            isActive: (attributes: { preventSingleLines: boolean }) => boolean;
          };
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom?: string;

                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines: boolean;
                pageBreakBefore?: boolean;
              }
            ) => boolean;
          };
        }) => {
          const isActive = editor.isActive({ preventSingleLines: true });
          return (
            commands.updateAttributes("paragraph", { preventSingleLines: !isActive }) ||
            commands.updateAttributes("heading", { preventSingleLines: !isActive })
          );
        },
      togglePageBreakBefore:
        () =>
        ({
          editor,
          commands,
        }: {
          editor: {
            isActive: (attributes: { pageBreakBefore: boolean }) => boolean;
          };
          commands: {
            updateAttributes: (
              type: string,
              attrs: {
                lineHeight?: string | null;
                marginTop?: string;
                marginBottom?: string;
                keepWithNext?: boolean;
                keepLinesTogether?: boolean;
                preventSingleLines?: boolean;
                pageBreakBefore: boolean;
              }
            ) => boolean;
          };
        }) => {
          const isActive = editor.isActive({ pageBreakBefore: true });
          return (
            commands.updateAttributes("paragraph", { pageBreakBefore: !isActive }) ||
            commands.updateAttributes("heading", { pageBreakBefore: !isActive })
          );
        },
    };
  },
});

export const LetterSpacingExtension = Extension.create({
  name: "letterSpacing",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          letterSpacing: {
            parseHTML: (element) => element.style.letterSpacing,
            renderHTML: (attributes) => {
              if (!attributes.letterSpacing) return {};
              return { style: `letter-spacing: ${attributes.letterSpacing}` };
            },
          },
        },
      },
    ];
  },
});

const TRUSTED_EMBED_ORIGINS = new Set([
  "https://www.youtube-nocookie.com",
  "https://www.youtube.com",
  "https://player.vimeo.com",
]);

const SAFE_HTML_ALLOWED_ATTR = [
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
  "data-embed-src",
  "colspan",
  "rowspan",
  "scope",
] as const;

const SAFE_HTML_ALLOWED_TAGS = [
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
] as const;

let embedSanitizeHookRegistered = false;

function registerEmbedSanitizeHook(): void {
  if (embedSanitizeHookRegistered || typeof window === "undefined") {
    return;
  }

  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName !== "data-embed-src") {
      return;
    }

    const trustedSrc = normalizeEmbedUrl(data.attrValue);
    if (!trustedSrc) {
      data.keepAttr = false;
      return;
    }

    data.attrValue = trustedSrc;
  });

  embedSanitizeHookRegistered = true;
}

/** Converts watch/share URLs to allowlisted embed URLs, or null if untrusted. */
export function normalizeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace(/^\//, "");
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.endsWith("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return `https://www.youtube-nocookie.com${parsed.pathname}`;
      }
    }

    if (parsed.hostname === "player.vimeo.com" && parsed.pathname.startsWith("/video/")) {
      return parsed.href;
    }

    if (TRUSTED_EMBED_ORIGINS.has(parsed.origin)) {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

function sanitizeRichHtml(html: string): string {
  registerEmbedSanitizeHook();

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: [...SAFE_HTML_ALLOWED_ATTR],
    ALLOWED_TAGS: [...SAFE_HTML_ALLOWED_TAGS],
    FORBID_TAGS: ["script", "object", "embed", "iframe"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

function mountTrustedEmbeds(container: HTMLElement): void {
  container.querySelectorAll("[data-embed-src]").forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const rawSrc = element.dataset.embedSrc;
    const trustedSrc = rawSrc ? normalizeEmbedUrl(rawSrc) : null;

    if (!trustedSrc) {
      element.remove();
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = trustedSrc;
    iframe.title = "Embedded media";
    iframe.loading = "lazy";
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-presentation allow-popups"
    );
    iframe.setAttribute("allowfullscreen", "");
    iframe.className = "aspect-video w-full rounded-xl border border-white/10";

    element.replaceWith(iframe);
  });
}

export function SafeHtml({ html, className }: Readonly<{ html: string; className?: string }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clean = useMemo(() => sanitizeRichHtml(html), [html]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    mountTrustedEmbeds(containerRef.current);
  }, [clean]);

  return (
    <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
