import { PROCESSING_STAGES, StageStatus } from "@/hooks/useProcessingAnimation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { cx } from "@/lib/utils";

const STAGE_ICONS: Record<(typeof PROCESSING_STAGES)[number], JSX.Element> = {
  "Analyzing Images": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.3" cy="9.3" r="1.3" fill="currentColor" />
      <path d="m5 17 4.5-5 3.2 3.6L15.5 12l3.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Detecting Faces": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5V8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M16 20h2.5a1.5 1.5 0 0 0 1.5-1.5V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  "Matching Students": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 19c.7-2.8 2.4-4.3 4.5-4.3s3.8 1.5 4.5 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m16 13 1.8 1.8L21.5 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Generating Attendance": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5.5" y="4" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 4V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};

function StageStatusIndicator({ status }: { status: StageStatus }) {
  if (status === "completed") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-surface-muted">
      <span className="block h-2 w-2 rounded-full bg-surface-muted" />
    </div>
  );
}

export function ProcessingTimeline({
  progress,
  statuses,
}: {
  progress: number;
  statuses: StageStatus[];
}) {
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-blue-light text-navy">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.5 4h-2A1.5 1.5 0 0 0 4 5.5v2M16.5 4h2A1.5 1.5 0 0 1 20 5.5v2M7.5 20h-2A1.5 1.5 0 0 1 4 18.5v-2M16.5 20h2a1.5 1.5 0 0 0 1.5-1.5v-2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="12" cy="10.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M8 16.5c.7-1.9 2.1-2.9 4-2.9s3.3 1 4 2.9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-lg font-bold text-navy">
          Processing in Progress
        </h2>
        <p className="mt-1.5 max-w-[260px] text-sm text-surface-muted">
          Our AI is detecting and recognizing students. This may take a few
          moments.
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-brand-blue transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold text-brand-blue">
          {Math.round(progress)}% Complete
        </p>
      </div>

      <div className="mt-5 border-t border-surface-border">
        {PROCESSING_STAGES.map((stage, i) => (
          <div
            key={stage}
            className={cx(
              "flex items-center gap-3 py-3.5",
              i < PROCESSING_STAGES.length - 1 && "border-b border-surface-border"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
              {STAGE_ICONS[stage]}
            </div>
            <p
              className={cx(
                "flex-1 text-sm font-semibold",
                statuses[i] === "pending" ? "text-surface-muted" : "text-navy"
              )}
            >
              {stage}
            </p>
            <StageStatusIndicator status={statuses[i]} />
          </div>
        ))}
      </div>
    </div>
  );
}
