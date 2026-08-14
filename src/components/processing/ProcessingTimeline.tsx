import { PROCESSING_STAGES, StageStatus } from "@/hooks/useProcessingAnimation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { cx } from "@/lib/utils";

const STATUS_LABEL: Record<StageStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
};

function StageIcon({ status }: { status: StageStatus }) {
  if (status === "completed") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  if (status === "in_progress") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
        <LoadingSpinner size={13} />
      </div>
    );
  }
  return (
    <div className="h-6 w-6 shrink-0 rounded-full border-2 border-surface-border bg-white" />
  );
}

export function ProcessingTimeline({
  statuses,
}: {
  statuses: StageStatus[];
}) {
  return (
    <ol className="relative">
      {PROCESSING_STAGES.map((stage, i) => (
        <li key={stage} className="relative flex gap-3 pb-6 last:pb-0">
          {i < PROCESSING_STAGES.length - 1 && (
            <span
              className={cx(
                "absolute left-[11px] top-6 h-full w-0.5",
                statuses[i] === "completed" ? "bg-success" : "bg-surface-border"
              )}
            />
          )}
          <StageIcon status={statuses[i]} />
          <div className="pt-0.5">
            <p
              className={cx(
                "text-sm font-semibold",
                statuses[i] === "pending" ? "text-surface-muted" : "text-navy"
              )}
            >
              {stage}
            </p>
            <p
              className={cx(
                "text-xs",
                statuses[i] === "completed" && "text-success",
                statuses[i] === "in_progress" && "text-brand-blue",
                statuses[i] === "pending" && "text-surface-muted"
              )}
            >
              {STATUS_LABEL[statuses[i]]}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
