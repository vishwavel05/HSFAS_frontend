import { cx } from "@/lib/utils";

export function LoadingSpinner({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={cx("animate-spin", className)}
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M22 12c0-5.523-4.477-10-10-10v3.5c3.59 0 6.5 2.91 6.5 6.5H22z"
      />
    </svg>
  );
}
