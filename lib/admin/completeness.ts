import { isPhotoKey } from "./validate";

/** A placeholder waiting for real words, like "[Name]" or "[Add a few lines in your own words.]". */
const PLACEHOLDER = /\[([^\]"]{2,})\]/g;
/** Brackets used in ordinary writing, which are not placeholders: [sic], […], footnote numbers. */
const EDITORIAL = /^(sic|\.\.\.|…|\d+)$/i;
const hasPlaceholder = (text: string) => [...text.matchAll(PLACEHOLDER)].some((m) => !EDITORIAL.test(m[1].trim()));
/** Fields that hold links, colours, slugs or photo ids rather than words. */
const NOT_TEXT = /^(href|.*Href|slug|bg|color|colors|focus|file|blur|id|type|kind|category|topic)$/;

/** Counts the words-fields in a content file, and how many still hold a placeholder. */
export function countText(value: unknown, key = ""): { texts: number; placeholders: number } {
  if (typeof value === "string") {
    if (NOT_TEXT.test(key) || isPhotoKey(key) || /^(#|\/|https?:|mailto:|data:)/.test(value)) return { texts: 0, placeholders: 0 };
    return { texts: 1, placeholders: hasPlaceholder(value) ? 1 : 0 };
  }
  const children: [string, unknown][] = Array.isArray(value)
    ? value.map((v) => [key, v])
    : value && typeof value === "object"
      ? Object.entries(value)
      : [];
  if (isPhotoKey(key)) return { texts: 0, placeholders: 0 };
  return children.reduce(
    (sum, [k, v]) => {
      const c = countText(v, k);
      return { texts: sum.texts + c.texts, placeholders: sum.placeholders + c.placeholders };
    },
    { texts: 0, placeholders: 0 },
  );
}
