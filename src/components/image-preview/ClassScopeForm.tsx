"use client";

import { Card } from "@/components/ui/Card";
import type { AttendanceScope } from "@/context/AttendanceFlowContext";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
const YEARS = ["1", "2", "3", "4"];
const SECTIONS = ["A", "B", "C", "D"];

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex-1">
      <label className="mb-1 block text-xs font-medium text-surface-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-surface-border bg-white px-2.5 py-2 text-sm font-medium text-navy outline-none focus:border-brand-blue"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * The mockup's Image Preview screen doesn't include class-scope fields, but
 * POST /api/attendance/ requires department/year/section (Backend_final.md).
 * There's no other screen in the PRD that collects them either, so this is
 * a real gap between the UI spec and the API contract — not a redesign of
 * an existing element. It's placed here, in the blank space the mockup
 * already leaves between the image grid and the action buttons, to stay as
 * close to the original layout as the requirement allows.
 */
export function ClassScopeForm({
  scope,
  onChange,
}: {
  scope: AttendanceScope;
  onChange: (scope: AttendanceScope) => void;
}) {
  return (
    <Card className="px-4 py-3.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-surface-muted">
        Class Details
      </p>
      <div className="mt-2.5 flex gap-2.5">
        <Select
          label="Department"
          value={scope.department}
          onChange={(v) => onChange({ ...scope, department: v })}
          options={DEPARTMENTS}
        />
        <Select
          label="Year"
          value={scope.year}
          onChange={(v) => onChange({ ...scope, year: v })}
          options={YEARS}
        />
        <Select
          label="Section"
          value={scope.section}
          onChange={(v) => onChange({ ...scope, section: v })}
          options={SECTIONS}
        />
      </div>
    </Card>
  );
}
