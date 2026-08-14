import { Card } from "@/components/ui/Card";

export function SummaryCards({
  present,
  absent,
}: {
  present: number;
  absent: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="flex flex-col items-center gap-1 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-light text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-xs font-medium text-surface-muted">Present</p>
        <p className="text-2xl font-extrabold text-success">{present}</p>
      </Card>

      <Card className="flex flex-col items-center gap-1 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-light text-danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M17.5 5.5l3 3m0-3-3 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-xs font-medium text-surface-muted">Absent</p>
        <p className="text-2xl font-extrabold text-danger">{absent}</p>
      </Card>
    </div>
  );
}
