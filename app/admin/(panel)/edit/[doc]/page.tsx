import { notFound } from "next/navigation";
import DocEditor from "@/components/admin/DocEditor";
import { docFile, getDoc } from "@/lib/admin/docs";
import { loadLibrary } from "@/lib/admin/photos";
import { readJson, storageInfo } from "@/lib/admin/storage";
import type { Category } from "@/lib/site";

export default async function EditPage({ params }: { params: Promise<{ doc: string }> }) {
  const doc = getDoc((await params).doc);
  if (!doc) notFound();

  const storage = storageInfo();
  const [data, library, sections] = await Promise.all([
    readJson<Record<string, never>>(docFile(doc.id)),
    loadLibrary(),
    readJson<{ categories: Category[] }>(docFile("categories")),
  ]);

  return (
    <DocEditor
      // A fresh editor for each file, so one file's unsaved edits never carry over to another.
      key={doc.id}
      doc={{ id: doc.id, title: doc.title, description: doc.description, view: doc.view }}
      initial={data}
      photos={library.photos.map(({ blur: _blur, ...p }) => p)}
      categories={sections.categories.map((c) => ({ slug: c.slug, label: c.label, topics: c.topics.map((t) => ({ slug: t.slug, label: t.label })) }))}
      mode={storage.mode}
      canSave={storage.ready}
    />
  );
}
