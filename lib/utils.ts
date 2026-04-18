/** Generates a unique id for new tasks (RFC 4122 UUID via Web Crypto). */
export function createTaskId(): string {
  return crypto.randomUUID();
}

/**
 * Returns a short relative label for a `YYYY-MM-DD` due date, or null if missing/invalid.
 * Uses "Today", "Tomorrow", "In X days" for today and future dates; past dates use
 * "Yesterday" or "N days ago".
 */
export function formatRelativeDueDate(isoDate: string | null | undefined): string | null {
  if (isoDate == null || String(isoDate).trim() === "") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate).trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mon = Number(m[2]);
  const d = Number(m[3]);
  const due = new Date(y, mon - 1, d);
  if (
    due.getFullYear() !== y ||
    due.getMonth() !== mon - 1 ||
    due.getDate() !== d
  ) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "Yesterday";
  return `${Math.abs(diffDays)} days ago`;
}

/** True when the due date (local calendar) is before today. */
export function isDueDatePast(isoDate: string | null | undefined): boolean {
  if (isoDate == null || String(isoDate).trim() === "") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate).trim());
  if (!m) return false;
  const due = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (
    due.getFullYear() !== Number(m[1]) ||
    due.getMonth() !== Number(m[2]) - 1 ||
    due.getDate() !== Number(m[3])
  ) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}
