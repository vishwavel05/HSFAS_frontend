export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Time-of-day greeting for the dashboard header. */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Human label like "3rd" from a raw year string, tolerant of "3" or "3rd". */
export function formatYearLabel(year: string): string {
  if (/(st|nd|rd|th)$/i.test(year)) return year;
  const n = parseInt(year, 10);
  if (Number.isNaN(n)) return year;
  const suffix =
    n % 10 === 1 && n !== 11
      ? "st"
      : n % 10 === 2 && n !== 12
      ? "nd"
      : n % 10 === 3 && n !== 13
      ? "rd"
      : "th";
  return `${n}${suffix}`;
}
