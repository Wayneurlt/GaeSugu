import PhotoLibrary from "@/components/admin/PhotoLibrary";
import { loadLibrary, photoUsage } from "@/lib/admin/photos";
import { storageInfo } from "@/lib/admin/storage";

export default async function PhotosPage() {
  const library = await loadLibrary();
  const usage = await photoUsage(library.photos.map((p) => p.id));
  const storage = storageInfo();

  return (
    <PhotoLibrary
      photos={library.photos.map(({ blur: _blur, ...p }) => p)}
      usage={usage}
      mode={storage.mode}
      canSave={storage.ready}
    />
  );
}
