/**
 * Complete Hindustan branding lockup — emblem, wordmark, and sub-lines are
 * all baked into the single asset at /assets/hindustan-logo.png.
 * Do not pair this with <HindustanWordmark /> or it will duplicate the text.
 *
 * Rendered with a plain <img> (not next/image) so the browser can use the
 * file's own intrinsic aspect ratio — its exact pixel dimensions weren't
 * provided, so a fixed width/height here could distort it.
 */
export function HindustanLogo({
  className = "h-11",
}: {
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/hindustan-logo.png"
      alt="Hindustan Institute of Technology & Science (Deemed to be University)"
      className={`w-auto shrink-0 object-contain ${className}`}
    />
  );
}

export function HindustanBadge40({
  className = "h-16",
}: {
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/hindustan-40-badge.png"
      alt="40 Years of Excellence in Education"
      className={`w-auto shrink-0 object-contain ${className}`}
    />
  );
}

/**
 * Kept for backward compatibility in case other screens still use the
 * text-only wordmark. Not used on the login screen anymore now that
 * hindustan-logo.png provides the complete branding lockup.
 */
export function HindustanWordmark({
  size = "sm",
}: {
  size?: "sm" | "lg";
}) {
  const isLg = size === "lg";
  return (
    <div className="leading-none">
      <p
        className={
          isLg
            ? "text-[26px] font-extrabold tracking-tight text-white"
            : "text-[15px] font-extrabold tracking-tight text-white"
        }
      >
        HINDUSTAN
      </p>
      <p
        className={
          isLg
            ? "mt-1 text-[10px] font-medium tracking-wide text-white/70"
            : "text-[6.5px] font-medium tracking-wide text-white/70"
        }
      >
        INSTITUTE OF TECHNOLOGY &amp; SCIENCE
      </p>
      {isLg && (
        <p className="text-[9px] font-medium tracking-wide text-white/70">
          (DEEMED TO BE UNIVERSITY)
        </p>
      )}
    </div>
  );
}
