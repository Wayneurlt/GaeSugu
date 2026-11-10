/**
 * Checks an edited content file before it is saved. The edit must keep the
 * same shape as the file it replaces (same fields, same kinds of values), so a
 * save can never leave the site with data its pages do not understand.
 */

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TEXT = 50_000;

const kind = (v: unknown) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);

/** A template for array items: every field seen in any item, and which are in all of them. */
function itemTemplate(items: Json[]) {
  const objects = items.filter((i): i is { [key: string]: Json } => kind(i) === "object");
  if (objects.length !== items.length || objects.length === 0) return { sample: items[0], fields: null, required: null };
  const fields: Record<string, Json[]> = {};
  for (const item of objects) for (const [k, v] of Object.entries(item)) (fields[k] ??= []).push(v);
  const required = Object.keys(fields).filter((k) => objects.every((o) => k in o));
  return { sample: objects[0], fields, required };
}

function label(path: string[]) {
  return path.length ? path.join(" › ") : "the file";
}

function check(next: unknown, current: Json, path: string[], errors: string[]) {
  if (errors.length > 20) return;
  const want = kind(current);
  const got = kind(next);

  if (want === "null") return; // nothing to compare against
  if (want !== got) {
    errors.push(`${label(path)} should be ${want === "array" ? "a list" : want === "object" ? "a group of fields" : `a ${want}`}.`);
    return;
  }

  if (got === "string" && (next as string).length > MAX_TEXT) errors.push(`${label(path)} is too long.`);
  if (got === "number" && !Number.isFinite(next)) errors.push(`${label(path)} must be a number.`);

  if (got === "object") {
    const cur = current as { [key: string]: Json };
    const nxt = next as Record<string, unknown>;
    for (const key of Object.keys(nxt)) {
      if (!(key in cur)) errors.push(`${label(path)} has an unknown field “${key}”.`);
      else check(nxt[key], cur[key], [...path, key], errors);
    }
    for (const key of Object.keys(cur)) if (!(key in nxt)) errors.push(`${label([...path, key])} is missing.`);
  }

  if (got === "array") {
    const cur = current as Json[];
    const nxt = next as unknown[];
    if (cur.length === 0) {
      // No example to compare with: accept plain JSON only.
      try {
        JSON.stringify(nxt);
      } catch {
        errors.push(`${label(path)} contains something that is not text or numbers.`);
      }
      return;
    }
    const template = itemTemplate(cur);
    const slugs = new Set<string>();
    nxt.forEach((item, i) => {
      const itemPath = [...path, String(i + 1)];
      if (!template.fields) {
        check(item, template.sample, itemPath, errors);
        return;
      }
      if (kind(item) !== "object") {
        errors.push(`${label(itemPath)} should be a group of fields.`);
        return;
      }
      const obj = item as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        const examples = template.fields[key];
        if (!examples) errors.push(`${label(itemPath)} has an unknown field “${key}”.`);
        else if (!examples.some((ex) => kind(ex) === kind(obj[key]))) check(obj[key], examples[0], [...itemPath, key], errors);
        else check(obj[key], examples.find((ex) => kind(ex) === kind(obj[key]))!, [...itemPath, key], errors);
      }
      for (const key of template.required!) if (!(key in obj)) errors.push(`${label([...itemPath, key])} is missing.`);
      if (typeof obj.slug === "string") {
        if (!SLUG.test(obj.slug)) {
          errors.push(`${label([...itemPath, "slug"])} “${obj.slug}” may only use lowercase letters, numbers and single dashes.`);
        } else if (slugs.has(obj.slug)) {
          errors.push(`${label([...itemPath, "slug"])} “${obj.slug}” is used twice in the same list.`);
        }
        slugs.add(obj.slug);
      }
    });
  }
}

export function validateDoc(next: unknown, current: unknown): string[] {
  const errors: string[] = [];
  check(next, current as Json, [], errors);
  return errors;
}

/** Field names that hold a photo id (or a list of them). */
export const isPhotoKey = (key: string) => key === "photo" || key === "photos" || key === "pastWeeks" || /Photo$/.test(key);

/** Finds every place a photo is used, as readable paths like "Homepage › culture › cards › 2 › photo". */
export function findPhotoUses(docTitle: string, data: unknown, photoId: string) {
  const uses: string[] = [];
  const walk = (value: unknown, path: string[], key: string) => {
    if (typeof value === "string") {
      if (value === photoId && isPhotoKey(key)) uses.push([docTitle, ...path].join(" › "));
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, [...path, String(i + 1)], key));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, [...path, k], k);
    }
  };
  walk(data, [], "");
  return uses;
}
