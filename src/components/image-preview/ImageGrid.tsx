"use client";

export function ImageGrid({
  images,
  onRemove,
}: {
  images: { previewUrl: string }[];
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((img, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <div
          key={img.previewUrl}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-surface-border bg-surface"
        >
          <img
            src={img.previewUrl}
            alt={`Classroom photo ${index + 1}`}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onRemove(index)}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-navy"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
