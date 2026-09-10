const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function toDateInputValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

export function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return toDateInputValue(d);
}

export function nightsBetween(a: string | Date, b: string | Date): number {
  const da = typeof a === "string" ? new Date(a + (a.length === 10 ? "T00:00:00Z" : "")) : a;
  const db = typeof b === "string" ? new Date(b + (b.length === 10 ? "T00:00:00Z" : "")) : b;
  const ms = db.getTime() - da.getTime();
  if (Number.isNaN(ms)) return 1;
  return Math.max(1, Math.round(ms / 86400000));
}

export function nightsLabel(n: number): string {
  return `${n} ${n === 1 ? "night" : "nights"}`;
}

export function rangeLabel(a: string | Date, b: string | Date): string {
  return `${fmtDate(a)} – ${fmtDate(b)}`;
}

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
