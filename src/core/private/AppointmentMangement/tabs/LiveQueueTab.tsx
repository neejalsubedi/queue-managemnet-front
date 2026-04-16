import { useMemo, useState } from "react";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import {
  useGetLiveAppointments,
  useCheckInAppointment,
  useStartAppointment,
  useCompleteAppointment,
  useFollowUpAppointment,
  useUpdateAppointment,
  useRescheduleAppointment,
  useCancelAppointment,
  useNoShowAppointment,
  useGetDoctor,
  useGetClinicsByStaff,
  useGetDepartment,
  useGetDoctorShift,
} from "@/components/ApiCall/Api";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { AppointmentStatusEnum, AppointmentTypeEnum } from "@/enums/AppointmentEnum";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { DAY_NAMES, formatTimeForApi, getDoctorShiftSummary, isDoctorUnavailable } from "../doctorAvailability";
import { DoctorScheduleCard } from "../DoctorScheduleCard";

const STATUS_LABEL: Record<string, string> = {
  [AppointmentStatusEnum.REQUESTED]: "Requested",
  [AppointmentStatusEnum.REJECTED]: "Rejected",
  [AppointmentStatusEnum.BOOKED]: "Booked",
  [AppointmentStatusEnum.CHECKED_IN]: "Checked In",
  [AppointmentStatusEnum.IN_PROGRESS]: "In Progress",
  [AppointmentStatusEnum.COMPLETED]: "Completed",
  [AppointmentStatusEnum.NO_SHOW]: "No Show",
  [AppointmentStatusEnum.CANCELLED]: "Cancelled",
};

const OTHER_STATUSES = [
  AppointmentStatusEnum.COMPLETED,
  AppointmentStatusEnum.REJECTED,
  AppointmentStatusEnum.NO_SHOW,
  AppointmentStatusEnum.CANCELLED,
];

function LiveCard({
  item,
  onSuccess,
  onFollowUpClick,
  onDetailsClick,
  highlight,
}: {
  item: any;
  onSuccess: () => void;
  onFollowUpClick?: (item: any) => void;
  onDetailsClick?: (item: any) => void;
  highlight?: boolean;
}) {
  const appt = item.appointment ?? item;
  const prediction = item.prediction;
  const checkIn = useCheckInAppointment(appt.id);
  const start = useStartAppointment(appt.id);
  const complete = useCompleteAppointment(appt.id);
  const status = appt.status;
  const queueNum = appt.queue_number ?? item.queue_position ?? "—";
  const waitMins = prediction?.predicted_wait_minutes ?? appt.estimated_wait_minutes ?? item.estimated_wait_minutes ?? null;
  const confidence = prediction?.confidence ?? appt.wait_time_confidence ?? item.wait_time_confidence ?? appt.confidence_level ?? item.confidence_level ?? null;

  const actions: { label: string; onClick: () => void; loading: boolean }[] = [];
  if (onDetailsClick) {
    actions.push({
      label: "Details",
      onClick: () => onDetailsClick(item),
      loading: false,
    });
  }
  if (status === AppointmentStatusEnum.BOOKED) {
    actions.push({
      label: "Check In",
      onClick: () => checkIn.mutate({}, { onSuccess }),
      loading: checkIn.isPending,
    });
  }
  if (status === AppointmentStatusEnum.CHECKED_IN) {
    actions.push({
      label: "Start",
      onClick: () => start.mutate({}, { onSuccess }),
      loading: start.isPending,
    });
  }
  if (status === AppointmentStatusEnum.IN_PROGRESS) {
    actions.push({
      label: "Complete",
      onClick: () => complete.mutate({}, { onSuccess }),
      loading: complete.isPending,
    });
  }
  if (status === AppointmentStatusEnum.COMPLETED && onFollowUpClick) {
    actions.push({
      label: "Follow Up",
      onClick: () => onFollowUpClick(item),
      loading: false,
    });
  }

  return (
    <Card className={highlight ? "ring-2 ring-primary bg-primary/5" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{appt.patient_name ?? "—"}</span>
          </CardTitle>
          <span
            className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-bold tabular-nums text-primary-foreground"
            title="Queue position"
          >
            #{queueNum}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {waitMins != null && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Est. wait</p>
            <p className="text-2xl font-bold tabular-nums text-primary">{waitMins} min</p>
            {confidence != null && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {typeof confidence === "number" ? `${Math.round(confidence * 100)}%` : String(confidence)} confidence
              </p>
            )}
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium">{STATUS_LABEL[status] ?? status}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Type</span>
          <span>{appt.appointment_type ?? "—"}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Time</span>
          <span>{appt.scheduled_start_time ?? "—"}</span>
        </div>
        {waitMins == null && confidence != null && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Confidence</span>
            <span className="tabular-nums">{typeof confidence === "number" ? `${Math.round(confidence * 100)}%` : String(confidence)}</span>
          </div>
        )}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t mt-2">
            {actions.map((a) => (
              <Button
                key={a.label}
                size="sm"
                variant={a.label === "Complete" ? "default" : "outline"}
                onClick={a.onClick}
                disabled={a.loading}
              >
                {a.loading ? "…" : a.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LiveQueueTab() {
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filters, setFilters] = useState<{
    clinicId?: string | number;
    departmentId?: string | number;
    doctorId?: string | number;
  }>({});
  const [otherOpen, setOtherOpen] = useState(false);

  const { data, isLoading, refetch } = useGetLiveAppointments(
    filters.clinicId,
    filters.departmentId,
    filters.doctorId,
    filtersApplied
  );

  const list = useMemo(() => (data?.data ?? []) as any[], [data]);

  const { inProgress, checkedIn, waiting, other } = useMemo(() => {
    const inProgress: any[] = [];
    const checkedIn: any[] = [];
    const waiting: any[] = [];
    const other: any[] = [];
    list.forEach((item) => {
      const appt = item.appointment ?? item;
      const st = appt.status;
      if (st === AppointmentStatusEnum.IN_PROGRESS) inProgress.push(item);
      else if (st === AppointmentStatusEnum.CHECKED_IN) checkedIn.push(item);
      else if (st === AppointmentStatusEnum.BOOKED) waiting.push(item);
      else if (OTHER_STATUSES.includes(st)) other.push(item);
    });
    checkedIn.sort((a, b) => {
      const qA = (a.appointment ?? a).queue_number ?? (a as any).queue_position ?? 9999;
      const qB = (b.appointment ?? b).queue_number ?? (b as any).queue_position ?? 9999;
      return Number(qA) - Number(qB);
    });
    waiting.sort((a, b) => {
      const qA = (a.appointment ?? a).queue_number ?? (a as any).queue_position ?? 9999;
      const qB = (b.appointment ?? b).queue_number ?? (b as any).queue_position ?? 9999;
      return Number(qA) - Number(qB);
    });
    return { inProgress, checkedIn, waiting, other };
  }, [list]);

  const hasOther = other.length > 0;
  const [followUpItem, setFollowUpItem] = useState<any>(null);
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [updateItem, setUpdateItem] = useState<any>(null);
  const [rescheduleItem, setRescheduleItem] = useState<any>(null);
  const [cancelConfirm, setCancelConfirm] = useState<any>(null);
  const [noShowConfirm, setNoShowConfirm] = useState<any>(null);

  return (
    <div className="space-y-4">
      <FilterAccordion
        title="Filters"
        dateRequired={false}
        onApply={({ values }) => {
          setFilters({
            clinicId: values.clinicId,
            departmentId: values.departmentId,
            doctorId: values.doctorId,
          });
          setFiltersApplied(true);
        }}
      >
        <AppointmentFilter />
      </FilterAccordion>

      {!filtersApplied && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Apply filters (clinic, department, doctor) to load the live queue.
          </CardContent>
        </Card>
      )}

      {filtersApplied && isLoading && (
        <p className="text-center text-muted-foreground">Loading live queue…</p>
      )}

      {filtersApplied && !isLoading && list.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No appointments in the live queue for the selected filters.
          </CardContent>
        </Card>
      )}

      {filtersApplied && !isLoading && list.length > 0 && (
        <div className="space-y-6">
          {/* In progress — highlighted */}
          {inProgress.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                Currently in progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgress.map((item) => (
                  <LiveCard
                    key={(item.appointment ?? item).id}
                    item={item}
                    onSuccess={refetch}
                    onFollowUpClick={setFollowUpItem}
                    onDetailsClick={setDetailsItem}
                    highlight
                  />
                ))}
              </div>
            </section>
          )}

          {/* Checked in — separate section */}
          {checkedIn.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                Checked in
              </h2>
              <p className="text-sm text-muted-foreground mb-3">Ordered by queue position</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {checkedIn.map((item) => (
                  <LiveCard
                    key={(item.appointment ?? item).id}
                    item={item}
                    onSuccess={refetch}
                    onFollowUpClick={setFollowUpItem}
                    onDetailsClick={setDetailsItem}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Waiting — BOOKED by queue */}
          {(waiting.length > 0) && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Waiting ({waiting.length})</h2>
              <p className="text-sm text-muted-foreground mb-3">Ordered by queue position</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waiting.map((item) => (
                  <LiveCard
                    key={(item.appointment ?? item).id}
                    item={item}
                    onSuccess={refetch}
                    onFollowUpClick={setFollowUpItem}
                    onDetailsClick={setDetailsItem}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Other — collapsible */}
          {hasOther && (
            <Collapsible open={otherOpen} onOpenChange={setOtherOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>Completed / Rejected / No show / Cancelled ({other.length})</span>
                  {otherOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {other.map((item) => (
                    <LiveCard
                      key={(item.appointment ?? item).id}
                      item={item}
                      onSuccess={refetch}
                      onFollowUpClick={setFollowUpItem}
                      onDetailsClick={setDetailsItem}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}

      {detailsItem != null && (
        <AppointmentDetailsDialog
          item={detailsItem}
          open={detailsItem != null}
          onOpenChange={(open) => !open && setDetailsItem(null)}
          onUpdate={() => {
            setUpdateItem(detailsItem);
            setDetailsItem(null);
          }}
          onReschedule={() => {
            setRescheduleItem(detailsItem);
            setDetailsItem(null);
          }}
          onCancelConfirm={() => setCancelConfirm(detailsItem)}
          onNoShowConfirm={() => setNoShowConfirm(detailsItem)}
        />
      )}

      {updateItem != null && (
        <UpdateAppointmentDialog
          item={updateItem}
          open={updateItem != null}
          onOpenChange={(open) => !open && setUpdateItem(null)}
          onSuccess={() => {
            setUpdateItem(null);
            refetch();
          }}
        />
      )}

      {rescheduleItem != null && (
        <RescheduleLiveDialog
          item={rescheduleItem}
          open={rescheduleItem != null}
          onOpenChange={(open) => !open && setRescheduleItem(null)}
          onSuccess={() => {
            setRescheduleItem(null);
            refetch();
          }}
        />
      )}

      {followUpItem != null && (
        <FollowUpDialog
          item={followUpItem}
          open={followUpItem != null}
          onOpenChange={(open) => !open && setFollowUpItem(null)}
          onSuccess={() => {
            setFollowUpItem(null);
            refetch();
          }}
        />
      )}

      {cancelConfirm != null && (
        <CancelConfirmWrap
          item={cancelConfirm}
          onClose={() => setCancelConfirm(null)}
          onSuccess={() => {
            setCancelConfirm(null);
            refetch();
          }}
        />
      )}
      {noShowConfirm != null && (
        <NoShowConfirmWrap
          item={noShowConfirm}
          onClose={() => setNoShowConfirm(null)}
          onSuccess={() => {
            setNoShowConfirm(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function AppointmentDetailsDialog({
  item,
  open,
  onOpenChange,
  onUpdate,
  onReschedule,
  onCancelConfirm,
  onNoShowConfirm,
}: {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onReschedule: () => void;
  onCancelConfirm: () => void;
  onNoShowConfirm: () => void;
}) {
  const appt = item?.appointment ?? item;
  const prediction = item?.prediction;
  const status = appt?.status;
  const canUpdate = [AppointmentStatusEnum.REQUESTED, AppointmentStatusEnum.BOOKED, AppointmentStatusEnum.CHECKED_IN].includes(status ?? "");
  const canReschedule = [AppointmentStatusEnum.REQUESTED, AppointmentStatusEnum.BOOKED, AppointmentStatusEnum.CHECKED_IN].includes(status);
  const canCancel = [AppointmentStatusEnum.REQUESTED, AppointmentStatusEnum.BOOKED, AppointmentStatusEnum.CHECKED_IN].includes(status ?? "");
  const canNoShow = status === AppointmentStatusEnum.BOOKED;

  const estWait = prediction?.predicted_wait_minutes ?? appt?.estimated_wait_minutes;
  const expl = prediction?.explanation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4 text-sm">
          <DetailRow label="Patient" value={appt?.patient_name} />
          <DetailRow label="Patient Phone" value={appt?.patient_phone} />
          <DetailRow label="Doctor" value={appt?.doctor_name} />
          <DetailRow label="Clinic" value={appt?.clinic_name} />
          <DetailRow label="Department" value={appt?.department_name} />
          <DetailRow label="Date" value={appt?.appointment_date} />
          <DetailRow label="Time" value={appt?.scheduled_start_time} />
          <DetailRow label="Status" value={status != null ? STATUS_LABEL[status] ?? status : undefined} />
          <DetailRow label="Type" value={appt?.appointment_type} />
          <DetailRow label="Queue" value={appt?.queue_number != null ? `#${appt.queue_number}` : undefined} />
          {estWait != null && <DetailRow label="Est. wait" value={`${estWait} min`} />}
          {appt?.is_walk_in != null && <DetailRow label="Walk-in" value={appt.is_walk_in ? "Yes" : "No"} />}
          <DetailRow label="Checked in time" value={appt?.checked_in_time} />
          <DetailRow label="Actual start" value={appt?.actual_start_time} />
          <DetailRow label="Actual end" value={appt?.actual_end_time} />
          <DetailRow label="Created by" value={appt?.appointment_created_by} />
          <DetailRow label="Approved by" value={appt?.appointment_approved_by} />
          <DetailRow label="Rescheduled by" value={appt?.appointment_rescheduled_by} />
          <DetailRow label="Cancelled by" value={appt?.appointment_cancelled_by} />
          <DetailRow label="Cancellation reason" value={appt?.cancellation_reason} />
          {appt?.notes && <DetailRow label="Notes" value={appt.notes} />}
          {(prediction?.confidence != null || prediction?.my_position != null) && (
            <>
              <div className="pt-2 mt-2 border-t font-medium text-muted-foreground">Wait time prediction</div>
              {prediction?.confidence != null && <DetailRow label="Confidence" value={prediction.confidence} />}
              {prediction?.my_position != null && <DetailRow label="Position in queue" value={prediction.my_position} />}
              {expl && (
                <>
                  <div className="pt-1 mt-1 text-muted-foreground font-medium">Explanation</div>
                  {expl.remaining_current_minutes != null && <DetailRow label="Remaining (current)" value={`${expl.remaining_current_minutes} min`} />}
                  {expl.patients_ahead != null && <DetailRow label="Patients ahead" value={expl.patients_ahead} />}
                  {expl.avg_duration_used != null && <DetailRow label="Avg duration used" value={`${expl.avg_duration_used} min`} />}
                  {expl.base_avg_duration != null && <DetailRow label="Base avg duration" value={`${expl.base_avg_duration} min`} />}
                  {expl.avg_start_delay != null && <DetailRow label="Avg start delay" value={`${expl.avg_start_delay} min`} />}
                  {expl.no_show_rate != null && <DetailRow label="No-show rate" value={typeof expl.no_show_rate === "number" ? `${(expl.no_show_rate * 100).toFixed(0)}%` : expl.no_show_rate} />}
                  {expl.model_used && <DetailRow label="Model" value={expl.model_used} />}
                </>
              )}
            </>
          )}
        </div>
        <DialogFooter className="flex-wrap gap-2">
          {canUpdate && <Button type="button" variant="outline" size="sm" onClick={onUpdate}>Update</Button>}
          {canReschedule && <Button type="button" variant="outline" size="sm" onClick={onReschedule}>Reschedule</Button>}
          {canCancel && <Button type="button" variant="outline" size="sm" onClick={onCancelConfirm}>Cancel</Button>}
          {canNoShow && <Button type="button" variant="outline" size="sm" onClick={onNoShowConfirm}>No-show</Button>}
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{String(value)}</span>
    </div>
  );
}

function UpdateAppointmentDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const appt = item?.appointment ?? item;
  const [clinic_id, setClinic_id] = useState(appt?.clinic_id ?? "");
  const [department_id, setDepartment_id] = useState(appt?.department_id ?? "");
  const [doctor_id, setDoctor_id] = useState(appt?.doctor_id ?? "");
  const [appointment_type, setAppointment_type] = useState(appt?.appointment_type ?? AppointmentTypeEnum.REGULAR_CHECKUP);
  const [scheduled_start_time, setScheduled_start_time] = useState(() => {
    const t = appt?.scheduled_start_time;
    if (!t) return "";
    const match = String(t).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1], 10);
      if (match[3].toUpperCase() === "PM" && h < 12) h += 12;
      if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
      return `${h.toString().padStart(2, "0")}:${match[2]}`;
    }
    return "";
  });
  const [notes, setNotes] = useState(appt?.notes ?? "");
  const [is_walk_in, setIs_walk_in] = useState(!!appt?.is_walk_in);
  const updateMutation = useUpdateAppointment(appt?.id);
  const { user } = useAuth();
  const { data: clinicData } = useGetClinicsByStaff(user?.userId);
  const { data: departmentData } = useGetDepartment(clinic_id || undefined);
  const { data: doctorData } = useGetDoctor(department_id || undefined);
  const { data: shiftData } = useGetDoctorShift(doctor_id || undefined, department_id || undefined);
  const appointmentDate = appt?.appointment_date ?? "";
  const doctorShiftSummary = getDoctorShiftSummary(shiftData as any, appointmentDate, doctor_id || undefined);

  const handleSubmit = () => {
    const body = {
      patient_id: appt?.patient_id,
      clinic_id: Number(clinic_id),
      department_id: Number(department_id),
      doctor_id: Number(doctor_id),
      appointment_type,
      scheduled_start_time: formatTimeForApi(scheduled_start_time) || scheduled_start_time,
      notes: notes || null,
      is_walk_in,
    };
    updateMutation.mutate(body as any, { onSuccess: () => { onSuccess(); onOpenChange(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Update appointment</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Clinic</Label>
            <select className="w-full border rounded-md h-10 px-3" value={clinic_id} onChange={(e) => setClinic_id(e.target.value)}>
              <option value="">Select</option>
              {clinicData?.data?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Department</Label>
            <select className="w-full border rounded-md h-10 px-3" value={department_id} onChange={(e) => setDepartment_id(e.target.value)} disabled={!clinic_id}>
              <option value="">Select</option>
              {(departmentData as { data?: any[] })?.data?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Doctor</Label>
            <select className="w-full border rounded-md h-10 px-3" value={doctor_id} onChange={(e) => setDoctor_id(e.target.value)} disabled={!department_id}>
              <option value="">Select</option>
              {(doctorData as { data?: any[] })?.data?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Type</Label>
            <select className="w-full border rounded-md h-10 px-3" value={appointment_type} onChange={(e) => setAppointment_type(e.target.value)}>
              {Object.values(AppointmentTypeEnum).map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <Label>Start time</Label>
            <Input name="upd_time" type="time" value={scheduled_start_time} onChange={(e) => setScheduled_start_time(e.target.value)} />
          </div>
          {doctor_id && appointmentDate && doctorShiftSummary && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <strong>Doctor availability ({DAY_NAMES[new Date(appointmentDate + "T12:00:00").getDay()]}):</strong> {doctorShiftSummary}
              </div>
              {clinic_id && (
                <DoctorScheduleCard
                  doctorId={doctor_id}
                  date={appointmentDate}
                  clinicId={clinic_id}
                  compact
                />
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={is_walk_in} onChange={(e) => setIs_walk_in(e.target.checked)} />
            <Label>Walk-in</Label>
          </div>
          <div>
            <Label>Notes</Label>
            <Input name="upd_notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={updateMutation.isPending || isDoctorUnavailable(doctorShiftSummary)}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RescheduleLiveDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const appt = item?.appointment ?? item;
  const [appointment_date, setAppointment_date] = useState(appt?.appointment_date ?? "");
  const [scheduled_start_time, setScheduled_start_time] = useState("");
  const [notes, setNotes] = useState("");
  const [clinic_id, setClinic_id] = useState<number | "">(appt?.clinic_id ?? "");
  const [department_id, setDepartment_id] = useState<number | "">(appt?.department_id ?? "");
  const [doctor_id, setDoctor_id] = useState<number | "">(appt?.doctor_id ?? "");
  const reschedule = useRescheduleAppointment(appt?.id);
  const { user } = useAuth();
  const { data: clinicData } = useGetClinicsByStaff(user?.userId);
  const { data: departmentData } = useGetDepartment(clinic_id || undefined);
  const { data: doctorData } = useGetDoctor(department_id || undefined);
  const effectiveDoctorId = doctor_id === "" ? appt?.doctor_id : doctor_id;
  const effectiveDeptId = department_id === "" ? appt?.department_id : department_id;
  const { data: shiftData } = useGetDoctorShift(effectiveDoctorId, effectiveDeptId);
  const doctorShiftSummary = getDoctorShiftSummary(shiftData as any, appointment_date, effectiveDoctorId);

  const handleSubmit = () => {
    if (!appointment_date || !scheduled_start_time) return;
    const body = {
      appointment_date,
      scheduled_start_time: formatTimeForApi(scheduled_start_time),
      notes: notes.trim() || undefined,
      doctor_id: doctor_id === "" ? undefined : doctor_id,
      clinic_id: clinic_id === "" ? undefined : clinic_id,
      department_id: department_id === "" ? undefined : department_id,
    };
    reschedule.mutate(body as any, { onSuccess: () => { onSuccess(); onOpenChange(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reschedule appointment</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Appointment date</Label>
            <Input name="res_date" type="date" value={appointment_date} onChange={(e) => setAppointment_date(e.target.value)} />
          </div>
          <div>
            <Label>Start time</Label>
            <Input name="res_time" type="time" value={scheduled_start_time} onChange={(e) => setScheduled_start_time(e.target.value)} />
          </div>
          {effectiveDoctorId && appointment_date && doctorShiftSummary && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <strong>Doctor availability ({DAY_NAMES[new Date(appointment_date + "T12:00:00").getDay()]}):</strong> {doctorShiftSummary}
              </div>
              {clinic_id && (
                <DoctorScheduleCard
                  doctorId={effectiveDoctorId}
                  date={appointment_date}
                  clinicId={clinic_id}
                  compact
                />
              )}
            </div>
          )}
          <div>
            <Label>Clinic (optional)</Label>
            <select className="w-full border rounded-md h-10 px-3" value={clinic_id === "" ? "" : clinic_id} onChange={(e) => setClinic_id(e.target.value === "" ? "" : Number(e.target.value))}>
              <option value="">Same</option>
              {clinicData?.data?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Department (optional)</Label>
            <select className="w-full border rounded-md h-10 px-3" value={department_id === "" ? "" : department_id} onChange={(e) => setDepartment_id(e.target.value === "" ? "" : Number(e.target.value))} disabled={!clinic_id}>
              <option value="">Same</option>
              {(departmentData as { data?: any[] })?.data?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Doctor (optional)</Label>
            <select className="w-full border rounded-md h-10 px-3" value={doctor_id === "" ? "" : doctor_id} onChange={(e) => setDoctor_id(e.target.value === "" ? "" : Number(e.target.value))} disabled={!department_id}>
              <option value="">Same</option>
              {(doctorData as { data?: any[] })?.data?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Notes</Label>
            <Input name="res_notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Patient requested reschedule" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={reschedule.isPending || !appointment_date || !scheduled_start_time || isDoctorUnavailable(doctorShiftSummary)}>Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelConfirmWrap({ item, onClose, onSuccess }: { item: any; onClose: () => void; onSuccess: () => void }) {
  const appt = item?.appointment ?? item;
  const cancel = useCancelAppointment(appt?.id);
  return (
    <ConfirmModal
      open={true}
      title="Cancel appointment?"
      description="This appointment will be marked as cancelled."
      onClose={onClose}
      onConfirm={() => cancel.mutate({}, { onSuccess })}
      confirmText="Cancel appointment"
      confirmLoading={cancel.isPending}
      actionType="delete"
    />
  );
}

function NoShowConfirmWrap({ item, onClose, onSuccess }: { item: any; onClose: () => void; onSuccess: () => void }) {
  const appt = item?.appointment ?? item;
  const noShow = useNoShowAppointment(appt?.id);
  return (
    <ConfirmModal
      open={true}
      title="Mark as no-show?"
      description="This appointment will be marked as no-show."
      onClose={onClose}
      onConfirm={() => noShow.mutate({}, { onSuccess })}
      confirmText="Mark no-show"
      confirmLoading={noShow.isPending}
      actionType="delete"
    />
  );
}

function FollowUpDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const appt = item?.appointment ?? item;
  const [appointment_date, setAppointment_date] = useState("");
  const [scheduled_start_time, setScheduled_start_time] = useState("");
  const [notes, setNotes] = useState("");
  const [doctor_id, setDoctor_id] = useState<number | "">("");
  const followUp = useFollowUpAppointment(appt?.id);
  const { data: doctorData } = useGetDoctor(appt?.department_id);
  const effectiveDoctorId = doctor_id === "" ? appt?.doctor_id : doctor_id;
  const { data: shiftData } = useGetDoctorShift(effectiveDoctorId, appt?.department_id);
  const doctorShiftSummary = getDoctorShiftSummary(shiftData as any, appointment_date, effectiveDoctorId);

  const handleSubmit = () => {
    if (!appointment_date || !scheduled_start_time) return;
    const body = {
      appointment_date,
      scheduled_start_time: formatTimeForApi(scheduled_start_time),
      appointment_type: "FOLLOW_UP" as const,
      notes: notes.trim() || undefined,
      doctor_id: doctor_id === "" ? undefined : doctor_id,
    };
    followUp.mutate(body as any, {
      onSuccess: () => {
        onSuccess();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule follow-up</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Appointment date</Label>
            <Input
              name="followUp_date"
              type="date"
              value={appointment_date}
              onChange={(e) => setAppointment_date(e.target.value)}
            />
          </div>
          <div>
            <Label>Start time</Label>
            <Input
              name="followUp_time"
              type="time"
              value={scheduled_start_time}
              onChange={(e) => setScheduled_start_time(e.target.value)}
            />
          </div>
          {effectiveDoctorId && appointment_date && doctorShiftSummary && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <strong>Doctor availability ({DAY_NAMES[new Date(appointment_date + "T12:00:00").getDay()]}):</strong> {doctorShiftSummary}
              </div>
              {appt?.clinic_id && (
                <DoctorScheduleCard
                  doctorId={effectiveDoctorId}
                  date={appointment_date}
                  clinicId={appt.clinic_id}
                  compact
                />
              )}
            </div>
          )}
          <div>
            <Label>Notes</Label>
            <Input
              name="followUp_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Post-treatment follow-up"
            />
          </div>
          {doctorData?.data?.length ? (
            <div>
              <Label>Doctor (optional)</Label>
              <select
                className="w-full border rounded-md h-10 px-3"
                value={doctor_id === "" ? "" : doctor_id}
                onChange={(e) => setDoctor_id(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <option value="">Same / Any</option>
                {doctorData.data.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={followUp.isPending || !appointment_date || !scheduled_start_time || isDoctorUnavailable(doctorShiftSummary)}
          >
            {followUp.isPending ? "Scheduling…" : "Schedule follow-up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
