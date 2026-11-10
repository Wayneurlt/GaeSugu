import Image from "next/image";
import type { CSSProperties } from "react";
import type { PhotoInfo } from "@/lib/photos";

export type PhotoFrameProps = {
  photo: PhotoInfo | undefined;
  /** Styles for the frame; set a height or aspect-ratio here. */
  style?: CSSProperties;
  className?: string;
  /** Responsive sizes hint, so the browser downloads the smallest file that fits. */
  sizes?: string;
  /** Load straight away (use for the first photo on the page only). */
  priority?: boolean;
  /** Decorative photos get an empty alt so screen readers skip them. */
  decorative?: boolean;
};

/**
 * A photo cropped to fill its frame, with a blurred preview while it loads.
 * Without a photo it renders the empty frame, so a missing image never breaks a page.
 */
export function PhotoFrame({ photo, style, className, sizes = "100vw", priority, decorative }: PhotoFrameProps) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      {photo && (
        <Image
          src={photo.file}
          alt={decorative ? "" : photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={photo.blur ? "blur" : "empty"}
          blurDataURL={photo.blur}
          style={{ objectFit: "cover", objectPosition: photo.focus || "50% 50%" }}
        />
      )}
    </div>
  );
}
