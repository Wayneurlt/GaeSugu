import { notFound } from "next/navigation";
import DocEditor from "@/components/admin/DocEditor";
import { docFile, getDoc } from "@/lib/admin/docs";
import { loadLibrary } from "@/lib/admin/photos";
import { readJson, storageInfo } from "@/lib/admin/storage";
import type { Category } from "@/lib/site";

type Props = { params: Promise<{ doc: string }>; searchParams: Promise<{ item?: string; new?: string }> };

/** ?item=<slug> opens that list item; ?new=1 (Articles) starts a new article. */
export default async function EditPage({ params, searchParams }: Props) {
  const doc = getDoc((await params).doc);
  if (!doc) notFound();
  const query = await searchParams;
  const item = typeof query.item === "string" && /^[a-z0-9-]{1,120}$/.test(query.item) ? query.item : undefined;
  const newItem = query.new === "1";

  const storage = storageInfo();
  const [data, library, sections] = await Promise.all([
    readJson<Record<string, never>>(docFile(doc.id)),
    loadLibrary(),
    readJson<{ categories: Category[] }>(docFile("categories")),
  ]);

  return (
    <DocEditor
      // A fresh editor for each file and shortcut, so unsaved edits never carry over to another.
      key={`${doc.id}:${item ?? ""}:${newItem ? "new" : ""}`}
      doc={{ id: doc.id, title: doc.title, description: doc.description, view: doc.view }}
      initial={data}
      photos={library.photos.map(({ blur: _blur, ...p }) => p)}
      categories={sections.categories.map((c) => ({ slug: c.slug, label: c.label, topics: c.topics.map((t) => ({ slug: t.slug, label: t.label })) }))}
      mode={storage.mode}
      canSave={storage.ready}
      focus={{ item, newItem }}
    />
  );
}
