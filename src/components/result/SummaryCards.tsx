import { Card } from "@/components/ui/Card";

export function SummaryCards({
  present,
  absent,
  processingTime,
}: {
  present: number;
  absent: number;
  processingTime?: number;
}) {
  const manualTime = (present + absent) * 6;
  const timeSaved = processingTime !== undefined ? Math.max(0, manualTime - processingTime) : 0;

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

      {processingTime !== undefined && (
        <>
          <Card className="flex flex-col items-center gap-1 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-surface-muted whitespace-nowrap">Processing Time</p>
            <p className="text-2xl font-extrabold text-blue-600">{processingTime.toFixed(1)}s</p>
          </Card>

          <Card className="flex flex-col items-center gap-1 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-surface-muted whitespace-nowrap">Time Saved</p>
            <p className="text-2xl font-extrabold text-emerald-600">
              {timeSaved >= 60 ? `${Math.floor(timeSaved / 60)}m ${Math.floor(timeSaved % 60)}s` : `${timeSaved.toFixed(1)}s`}
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
