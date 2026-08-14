import { Checkbox } from "@/components/ui/Checkbox";
import type { AttendanceRecord } from "@/types/attendance";
import { cx } from "@/lib/utils";

export function AttendanceRow({
  record,
  isEditing,
  isPendingChange,
  onToggle,
}: {
  record: AttendanceRecord;
  isEditing: boolean;
  isPendingChange: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cx(
        "grid grid-cols-[24px_1.3fr_1fr_0.6fr_0.6fr] items-center gap-2 border-b border-surface-border px-1 py-2 text-xs last:border-b-0",
        isPendingChange && "bg-brand-blue-light/50"
      )}
    >
      <Checkbox
        aria-label={`Toggle attendance for ${record.display_name}`}
        checked={record.status === "present"}
        disabled={!isEditing}
        onChange={onToggle}
      />
      <div>
        <p className="font-semibold text-navy">{record.roll_number}</p>
        <p className="text-surface-muted">{record.display_name}</p>
      </div>
      <p className="text-surface-muted">{record.department}</p>
      <p className="text-surface-muted">{record.year}</p>
      <p className="text-surface-muted">{record.section}</p>
    </div>
  );
}
