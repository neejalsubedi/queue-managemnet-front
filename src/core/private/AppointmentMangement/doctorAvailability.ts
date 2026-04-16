export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Format "HH:mm" (24h) to "10:30 AM" / "2:00 PM" for API. Leaves "H:mm AM/PM" unchanged. */
export function formatTimeForApi(value: string): string {
  if (!value) return "";
  const parts = value.trim().split(/\s+/);
  const timePart = parts[0] ?? "";
  const [h, m] = timePart.split(":").map(Number);
  if (h == null || isNaN(h)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const min = (m != null && !isNaN(m) ? m : 0).toString().padStart(2, "0");
  return `${hour}:${min} ${period}`;
}

export function getDayOfWeek(dateStr: string): number {
  if (!dateStr) return -1;
  const d = new Date(dateStr + "T12:00:00");
  return d.getDay();
}

export function getDoctorShiftSummary(
  shiftData: any,
  appointmentDate: string | undefined,
  doctorId: string | number | undefined
): string | null {
  const shifts = shiftData?.data ?? [];
  if (!appointmentDate || !doctorId || shifts.length === 0) return null;
  const dayOfWeek = getDayOfWeek(appointmentDate);
  const dayShift = shifts.find((s: any) => Number(s.day_of_week) === dayOfWeek);
  if (!dayShift) return "No shift for this day.";
  if (dayShift.is_day_off) return "Day off.";
  const start = dayShift.start_time ?? "";
  const end = dayShift.end_time ?? "";
  return start && end ? `${start} – ${end}` : "Shift set";
}

export function isDoctorUnavailable(summary: string | null): boolean {
  return summary === "No shift for this day." || summary === "Day off.";
}
