"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Palette,
  CheckSquare,
  Eraser,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  X,
  BookOpen,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowDownUp,
  Check,
} from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";

export type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  tooltip?: string;
  children?: React.ReactNode;
};

export function ToolbarButton({
  active,
  disabled,
  onClick,
  icon: Icon,
  tooltip,
  children,
}: Readonly<ToolbarButtonProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        group relative flex h-8 w-8 items-center justify-center rounded-lg transition-all
        ${disabled ? "cursor-not-allowed opacity-30" : "hover:bg-muted"}
        ${active ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground"}
      `}
      aria-label={tooltip}
      aria-pressed={active}
    >
      {Icon ? <Icon className="h-4 w-4" /> : children}
    </button>
  );
}

export type LinkFormData = {
  text: string;
  url: string;
};

type EditorToolbarProps = {
  editor: Editor;
  isTocActive: boolean;
  handleToggleTocHeading: () => void;
  handleHeadingClick: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  handleUploadImage: () => void;
  handleInsertTable: () => void;
  showLinkModal: boolean;
  setShowLinkModal: (show: boolean) => void;
  linkForm: LinkFormData;
  setLinkForm: (form: LinkFormData) => void;
  handleInsertLink: (form: LinkFormData) => boolean;
};

export function EditorToolbar({
  editor,
  isTocActive,
  handleToggleTocHeading,
  handleHeadingClick,
  handleUploadImage,
  handleInsertTable,
  showLinkModal,
  setShowLinkModal,
  linkForm,
  setLinkForm,
  handleInsertLink,
}: Readonly<EditorToolbarProps>) {
  return (
    <>
      {/* Toolbar */}
      <div className="shrink-0 flex flex-wrap items-center gap-1 border-b border-border bg-card backdrop-blur-sm p-2 rounded-t-2xl z-10">
        {/* History */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border">
          <ToolbarButton
            icon={Undo}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo"
          />
          <ToolbarButton
            icon={Redo}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo"
          />
        </div>

        {/* Headings */}
        <ToolbarButton
          icon={Heading1}
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => handleHeadingClick(1)}
          tooltip="Heading 1"
        />
        <ToolbarButton
          icon={Heading2}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => handleHeadingClick(2)}
          tooltip="Heading 2"
        />
        <ToolbarButton
          icon={Heading3}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => handleHeadingClick(3)}
          tooltip="Heading 3"
        />
        <ToolbarButton
          icon={Heading4}
          active={editor.isActive("heading", { level: 4 })}
          onClick={() => handleHeadingClick(4)}
          tooltip="Heading 4"
        />
        <ToolbarButton
          icon={Heading5}
          active={editor.isActive("heading", { level: 5 })}
          onClick={() => handleHeadingClick(5)}
          tooltip="Heading 5"
        />
        <ToolbarButton
          icon={Heading6}
          active={editor.isActive("heading", { level: 6 })}
          onClick={() => handleHeadingClick(6)}
          tooltip="Heading 6"
        />

        <ToolbarButton
          icon={BookOpen}
          active={isTocActive}
          onClick={handleToggleTocHeading}
          tooltip="Toggle Table of Contents Heading"
        />

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Marks */}
        <ToolbarButton
          icon={Bold}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          tooltip="Bold"
        />
        <ToolbarButton
          icon={Italic}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltip="Italic"
        />
        <ToolbarButton
          icon={UnderlineIcon}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          tooltip="Underline"
        />
        <ToolbarButton
          icon={Highlighter}
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          tooltip="Highlight"
        />

        {/* Text Color Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`rounded-lg p-2 transition-colors hover:bg-muted ${
              editor.getAttributes("textStyle").color
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Text Color"
          >
            <Palette className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="p-3 w-auto bg-card border-border"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground mb-2">
              Text Color
            </DropdownMenuLabel>
            <div className="grid grid-cols-6 gap-1.5">
              {[
                "#000000",
                "#374151",
                "#6B7280",
                "#DC2626",
                "#EA580C",
                "#F59E0B",
                "#16A34A",
                "#0EA5E9",
                "#2563EB",
                "#7C3AED",
                "#DB2777",
                "#FF7904",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    editor.getAttributes("textStyle").color === color
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  title={color}
                />
              ))}
            </div>
            <DropdownMenuSeparator className="my-2 bg-border" />
            <button
              type="button"
              className="w-full text-xs text-muted-foreground hover:text-foreground py-1 text-center"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Reset Color
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarButton
          icon={Code}
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          tooltip="Code"
        />
        <ToolbarButton
          icon={Eraser}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          tooltip="Clear Formatting"
        />

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Lists */}
        <ToolbarButton
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltip="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltip="Numbered List"
        />
        <ToolbarButton
          icon={CheckSquare}
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          tooltip="Task List"
        />
        <ToolbarButton
          icon={Quote}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          tooltip="Quote"
        />

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Alignment */}
        <ToolbarButton
          icon={AlignLeft}
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          tooltip="Align Left"
        />
        <ToolbarButton
          icon={AlignCenter}
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          tooltip="Align Center"
        />
        <ToolbarButton
          icon={AlignRight}
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          tooltip="Align Right"
        />
        <ToolbarButton
          icon={AlignJustify}
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          tooltip="Align Justify"
        />

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Line / Paragraph Formatting */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className="group relative flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Line & paragraph spacing"
            aria-label="Line & paragraph spacing"
          >
            <ArrowDownUp className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-card p-1 z-60 shadow-xl border-border rounded-lg">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => editor.chain().focus().setLineHeight("1").run()}
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ lineHeight: "1" }) ||
                (!editor.isActive({ lineHeight: "1.15" }) &&
                  !editor.isActive({ lineHeight: "1.5" }) &&
                  !editor.isActive({ lineHeight: "2" })) ? (
                  <Check className="h-4 w-4" />
                ) : null}
              </div>
              <span
                className={
                  editor.isActive({ lineHeight: "1" }) ? "font-medium" : ""
                }
              >
                Single
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => editor.chain().focus().setLineHeight("1.15").run()}
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ lineHeight: "1.15" }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span
                className={
                  editor.isActive({ lineHeight: "1.15" }) ? "font-medium" : ""
                }
              >
                1.15
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => editor.chain().focus().setLineHeight("1.5").run()}
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ lineHeight: "1.5" }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span
                className={
                  editor.isActive({ lineHeight: "1.5" }) ? "font-medium" : ""
                }
              >
                1.5
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => editor.chain().focus().setLineHeight("2").run()}
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ lineHeight: "2" }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span
                className={
                  editor.isActive({ lineHeight: "2" }) ? "font-medium" : ""
                }
              >
                Double
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-border" />

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => {
                if (editor.isActive({ marginTop: "1rem" })) {
                  editor.chain().focus().unsetSpaceBefore().run();
                } else {
                  editor.chain().focus().setSpaceBefore("1rem").run();
                }
              }}
            >
              <div className="w-4 flex justify-center" />
              <span>
                {editor.isActive({ marginTop: "1rem" })
                  ? "Remove space before paragraph"
                  : "Add space before paragraph"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => {
                if (editor.isActive({ marginBottom: "1rem" })) {
                  editor.chain().focus().unsetSpaceAfter().run();
                } else {
                  editor.chain().focus().setSpaceAfter("1rem").run();
                }
              }}
            >
              <div className="w-4 flex justify-center" />
              <span>
                {editor.isActive({ marginBottom: "1rem" })
                  ? "Remove space after paragraph"
                  : "Add space after paragraph"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => {
                const space = prompt(
                  "Enter custom spacing (e.g., 1.5rem, 24px):",
                  "1.5rem",
                );
                if (space) {
                  editor.chain().focus().setSpaceAfter(space).run();
                }
              }}
            >
              <div className="w-4 flex justify-center" />
              <span>Custom spacing</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-border" />

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() => editor.chain().focus().toggleKeepWithNext().run()}
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ keepWithNext: true }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span>Keep with next</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() =>
                editor.chain().focus().toggleKeepLinesTogether().run()
              }
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ keepLinesTogether: true }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span>Keep lines together</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() =>
                editor.chain().focus().togglePreventSingleLines().run()
              }
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ preventSingleLines: true }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span>Prevent single lines</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded px-3 py-2 text-sm text-foreground focus:bg-muted"
              onClick={() =>
                editor.chain().focus().togglePageBreakBefore().run()
              }
            >
              <div className="w-4 flex justify-center text-foreground">
                {editor.isActive({ pageBreakBefore: true }) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span>Add page break before</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Media & Links */}
        <ToolbarButton
          icon={LinkIcon}
          active={editor.isActive("link")}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }

            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, " ");
            setLinkForm({ text: selectedText, url: "" });
            setShowLinkModal(true);
          }}
          tooltip="Insert Link"
        />
        <ToolbarButton
          icon={ImageIcon}
          onClick={handleUploadImage}
          tooltip="Insert Image"
        />
        <ToolbarButton
          icon={TableIcon}
          onClick={handleInsertTable}
          tooltip="Insert Table"
        />
      </div>

      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Insert Link
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkForm({ text: "", url: "" });
                }}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close link modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (handleInsertLink(linkForm)) {
                  setShowLinkModal(false);
                  setLinkForm({ text: "", url: "" });
                }
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="linkText"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Link Text
                </label>
                <input
                  type="text"
                  id="linkText"
                  value={linkForm.text}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, text: e.target.value })
                  }
                  placeholder="e.g., Click here"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="linkUrl"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="linkUrl"
                  value={linkForm.url}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, url: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  pattern="https?://.+"
                  title="Please enter a valid URL starting with http:// or https://"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02]"
                >
                  Insert Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkForm({ text: "", url: "" });
                  }}
                  className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
