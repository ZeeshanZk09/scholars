import DOMPurify from "isomorphic-dompurify";

const SAFE_URI =
  /^(?:(?:https?|mailto|tel):|\/|data:image\/(?:png|jpe?g|gif|webp);base64,|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

/**
 * Server-side HTML sanitization applied to rich content before it is stored.
 * Client-side DOMPurify (editor) is defense-in-depth only; the server must not
 * trust content that arrives over the wire.
 */
export function sanitizeRichHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "hr",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "class",
      "colspan",
      "rowspan",
    ],
    ALLOWED_URI_REGEXP: SAFE_URI,
    FORBID_TAGS: [
      "style",
      "form",
      "input",
      "button",
      "iframe",
      "object",
      "embed",
      "script",
      "svg",
      "math",
      "link",
      "meta",
    ],
    FORBID_ATTR: [
      "style",
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onmouseout",
      "onkeydown",
      "onkeyup",
    ],
  });
}