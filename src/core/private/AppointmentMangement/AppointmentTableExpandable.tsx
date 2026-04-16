import { ReactNode } from "react";

type AppointmentRowLike = {
  appointment_created_by?: string | null;
  appointment_approved_by?: string | null;
  appointment_rescheduled_by?: string | null;
  appointment_cancelled_by?: string | null;
  cancellation_reason?: string | null;
  notes?: string | null;
  [key: string]: unknown;
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1">{children}</div>
    </div>
  );
}

export function AppointmentTableExpandable({ row }: { row: AppointmentRowLike }) {
  const hasAudit =
    row.appointment_created_by ??
    row.appointment_approved_by ??
    row.appointment_rescheduled_by ??
    row.appointment_cancelled_by;
  const hasExtra = hasAudit || row.cancellation_reason || row.notes;

  if (!hasExtra) return <p className="text-sm text-muted-foreground">No additional details.</p>;

  return (
    <div className="space-y-4">
      {hasAudit && (
        <Section title="Audit">
          <Row label="Created by" value={row.appointment_created_by ?? undefined} />
          <Row label="Approved by" value={row.appointment_approved_by ?? undefined} />
          <Row label="Rescheduled by" value={row.appointment_rescheduled_by ?? undefined} />
          <Row label="Cancelled by" value={row.appointment_cancelled_by ?? undefined} />
        </Section>
      )}
      {row.cancellation_reason && (
        <Section title="Cancellation">
          <Row label="Reason" value={row.cancellation_reason} />
        </Section>
      )}
      {row.notes && (
        <Section title="Notes">
          <p className="text-sm">{row.notes}</p>
        </Section>
      )}
    </div>
  );
}
