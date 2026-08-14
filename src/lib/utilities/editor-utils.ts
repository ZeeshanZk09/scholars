export { slugify } from "@/lib/utils/slug";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function calculateWordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}
