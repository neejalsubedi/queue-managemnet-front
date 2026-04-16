import { useGetDoctorSchedule } from "@/components/ApiCall/Api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, FileText } from "lucide-react";

/** Format "HH:mm:ss" or "HH:mm" to short time e.g. "10:00 AM" */
function formatTime(t: string): string {
  if (!t) return "—";
  const parts = t.trim().split(/[:\s]/);
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parts[1] ? parseInt(parts[1], 10) : 0;
  if (h >= 12) return `${h === 12 ? 12 : h - 12}:${String(m).padStart(2, "0")} PM`;
  return `${h === 0 ? 12 : h}:${String(m).padStart(2, "0")} AM`;
}

type DoctorScheduleCardProps = {
  doctorId: string | number | undefined;
  date: string | undefined;
  clinicId: string | number | undefined;
  /** Optional title override */
  title?: string;
  /** Compact layout (e.g. inside dialogs) */
  compact?: boolean;
};

export function DoctorScheduleCard({
  doctorId,
  date,
  clinicId,
  title = "Doctor's appointments on this day",
  compact = false,
}: DoctorScheduleCardProps) {
  const { data, isLoading } = useGetDoctorSchedule(doctorId, date, clinicId);
  const list = (data as any)?.data ?? [];

  if (!doctorId || !date || !clinicId) return null;

  if (isLoading) {
    return (
      <Card className={compact ? "border-border" : ""}>
        <CardHeader className={compact ? "py-2 px-3" : ""}>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className={compact ? "py-0 px-3 pb-3" : ""}>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? "border-border" : ""}>
      <CardHeader className={compact ? "py-2 px-3" : ""}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className={compact ? "py-0 px-3 pb-3" : ""}>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments booked for this day.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((appt: any) => (
              <li
                key={appt.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-muted/50 px-2 py-1.5 text-sm"
              >
                <span className="inline-flex items-center gap-1 font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatTime(appt.scheduled_start_time)}
                  {appt.estimated_duration != null && (
                    <span className="text-muted-foreground font-normal">
                      ({appt.estimated_duration} min)
                    </span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {appt.appointment_type?.replace("_", " ") ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {appt.patient_name ?? "—"}
                </span>
                {appt.status && (
                  <span className="ml-auto text-xs font-medium text-muted-foreground">{appt.status}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
