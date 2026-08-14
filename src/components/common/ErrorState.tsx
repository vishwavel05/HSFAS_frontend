import { Button } from "@/components/ui/Button";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again",
  secondaryAction,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryAction?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-danger/20 bg-danger-light px-5 py-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-danger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-navy">{title}</p>
        <p className="mt-1 text-sm text-surface-muted">{message}</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
