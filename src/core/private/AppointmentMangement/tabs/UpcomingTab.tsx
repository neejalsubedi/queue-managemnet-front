import { useState, useMemo, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import {
  useGetUpcomingAppointments,
  useApproveAppointment,
  useRejectAppointment,
  useRescheduleAppointment,
  useGetClinicsByStaff,
  useGetDepartment,
  useGetDoctor,
  useGetDoctorShift,
} from "@/components/ApiCall/Api";
import { useAuth } from "@/components/ContextApi/AuthContext";
import Table, { Column } from "@/components/ui/table";
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
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { AppointmentTypeEnum } from "@/enums/AppointmentEnum";
import type { ApproveAppointmentBody, RejectAppointmentBody, RescheduleAppointmentBody } from "../types";
import { DAY_NAMES, formatTimeForApi, getDoctorShiftSummary, isDoctorUnavailable } from "../doctorAvailability";
import { DoctorScheduleCard } from "../DoctorScheduleCard";
import { AppointmentTableExpandable } from "../AppointmentTableExpandable";

type UpcomingRow = {
  id: number;
  patient_name?: string;
  patient_phone?: string;
  doctor_name?: string;
  department_name?: string;
  clinic_name?: string;
  appointment_date?: string;
  scheduled_start_time?: string;
  status?: string;
  appointment_type?: string;
  patient_id?: number;
  clinic_id?: number;
  department_id?: number;
  doctor_id?: number;
  notes?: string | null;
  appointment_created_by?: string | null;
  appointment_approved_by?: string | null;
  appointment_rescheduled_by?: string | null;
  appointment_cancelled_by?: string | null;
};

const UPCOMING_STATUS_OPTIONS = ["REQUESTED", "BOOKED", "REJECTED"] as const;

function UpcomingClinicSelect() {
  const { register } = useFormContext();
  const { user } = useAuth();
  const { data: clinicData } = useGetClinicsByStaff(user?.userId);
  return (
    <div>
      <Label>Clinic</Label>
      <select
        {...register("clinicId")}
        className="w-full border rounded-md h-10 px-3"
      >
        <option value="">Select Clinic</option>
        {clinicData?.data?.map((clinic: any) => (
          <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
        ))}
      </select>
    </div>
  );
}

function UpcomingStatusFilter() {
  const { register } = useFormContext();
  return (
    <div>
      <Label>Status</Label>
      <select className="w-full border rounded-md h-10 px-3" {...register("status")}>
        <option value="">Select status</option>
        {UPCOMING_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}

function UpcomingDeptDoctorFilter() {
  const { register, control, setValue } = useFormContext();
  const clinicId = useWatch({ control, name: "clinicId" });
  const departmentId = useWatch({ control, name: "departmentId" });
  const { data: departmentData } = useGetDepartment(clinicId);
  const { data: doctorData } = useGetDoctor(departmentId);

  useEffect(() => {
    setValue("departmentId", "");
    setValue("doctorId", "");
  }, [clinicId, setValue]);
  useEffect(() => {
    setValue("doctorId", "");
  }, [departmentId, setValue]);

  return (
    <>
      <div>
        <Label>Department (optional)</Label>
        <select
          {...register("departmentId")}
          disabled={!clinicId}
          className="w-full border rounded-md h-10 px-3"
        >
          <option value="">Select Department</option>
          {departmentData?.data?.map((dept: any) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Doctor (optional)</Label>
        <select
          {...register("doctorId")}
          disabled={!departmentId}
          className="w-full border rounded-md h-10 px-3"
        >
          <option value="">Select Doctor</option>
          {doctorData?.data?.map((doc: any) => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
        </select>
      </div>
    </>
  );
}

function UpcomingAppointmentTypeFilter() {
  const { register } = useFormContext();
  return (
    <div>
      <Label>Appointment type (optional)</Label>
      <select className="w-full border rounded-md h-10 px-3" {...register("appointment_type")}>
        <option value="">All</option>
        {Object.values(AppointmentTypeEnum).map((t) => (
          <option key={t} value={t}>{t.replace("_", " ")}</option>
        ))}
      </select>
    </div>
  );
}

function UpcomingPatientNameFilter() {
  const { register } = useFormContext();
  return (
    <div>
      <Label>Patient name (optional)</Label>
      <Input
        className="h-10"
        placeholder="Search by patient name"
        {...register("patient_name")}
      />
    </div>
  );
}

export default function UpcomingTab() {
  const queryClient = useQueryClient();
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filters, setFilters] = useState<{
    date_from?: string;
    date_to?: string;
    status?: string;
    clinic_id?: number;
    department_id?: string | number;
    doctor_id?: string | number;
    appointment_type?: string;
    patient_name?: string;
    page?: number;
    limit?: number;
  }>({ page: 1, limit: 10 });
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UpcomingRow | null>(null);

  const { data, isLoading } = useGetUpcomingAppointments({
    date_from: filters.date_from,
    date_to: filters.date_to,
    status: filters.status,
    clinic_id: filters.clinic_id,
    department_id: filters.department_id,
    doctor_id: filters.doctor_id,
    appointment_type: filters.appointment_type,
    patient_name: filters.patient_name,
    page: filters.page,
    limit: filters.limit,
    enabled: filtersApplied,
  });

  const rows = useMemo(() => {
    if (!filtersApplied || !data) return [];
    const inner = (data as any)?.data;
    const list = Array.isArray(inner?.data) ? inner.data : Array.isArray(inner) ? inner : [];
    return list as UpcomingRow[];
  }, [data, filtersApplied]);
  const pagination = (data as any)?.data?.pagination;
  const totalItems = pagination?.total ?? rows.length;

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.APPOINTMENT.UPCOMING] });
  };

  const columns: Column<UpcomingRow>[] = useMemo(
    () => [
      {
        header: "Patient",
        accessor: (row) => (
          <span>
            {row.patient_name ?? "—"}
            {row.patient_phone ? <span className="text-muted-foreground text-xs block mt-0.5">{row.patient_phone}</span> : null}
          </span>
        ),
      },
      { header: "Doctor", accessor: "doctor_name" },
      { header: "Department", accessor: "department_name" },
      { header: "Clinic", accessor: "clinic_name" },
      { header: "Date", accessor: "appointment_date" },
      { header: "Time", accessor: "scheduled_start_time" },
      { header: "Status", accessor: "status", expandable: (row) => <AppointmentTableExpandable row={row} /> },
      { header: "Type", accessor: "appointment_type" },
      {
        header: "Actions",
        accessor: (row) => (
          <div className="flex gap-1 flex-wrap">
            {row.status === "REQUESTED" && (
              <>
                <Button size="sm" variant="default" onClick={() => { setSelectedRow(row); setApproveOpen(true); }}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => { setSelectedRow(row); setRejectOpen(true); }}>Reject</Button>
              </>
            )}
            {(row.status === "REQUESTED" || row.status === "BOOKED") && (
              <Button size="sm" variant="outline" onClick={() => { setSelectedRow(row); setRescheduleOpen(true); }}>Reschedule</Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <FilterAccordion
        title="Filters"
        dateRequired={true}
        requireDepartment={false}
        requireStatus={true}
        onApply={({ range, values }) => {
          setFilters((prev) => ({
            ...prev,
            date_from: range?.from ?? prev.date_from,
            date_to: range?.to ?? prev.date_to,
            clinic_id: values.clinicId,
            department_id: values.departmentId,
            doctor_id: values.doctorId,
            status: values.status ?? prev.status,
            appointment_type: values.appointment_type ?? prev.appointment_type,
            patient_name: values.patient_name ?? prev.patient_name,
            page: 1,
          }));
          setFiltersApplied(true);
        }}
        onReset={() => {
          setFilters({ page: 1, limit: 10 });
          setFiltersApplied(false);
        }}
      >
        <UpcomingClinicSelect />
        <UpcomingStatusFilter />
        <UpcomingDeptDoctorFilter />
        <UpcomingAppointmentTypeFilter />
        <UpcomingPatientNameFilter />
      </FilterAccordion>

      {!filtersApplied && (
        <div className="rounded-lg border bg-muted/30 py-12 text-center text-muted-foreground">
          Apply filters to load upcoming appointments (REQUESTED and BOOKED).
        </div>
      )}

      {filtersApplied && (
        <Table<UpcomingRow>
          data={rows}
          columns={columns}
          loading={isLoading}
          pagination={true}
          totalItems={totalItems}
          page={filters.page ?? 1}
          itemsPerPage={filters.limit ?? 10}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          fitToViewport
        />
      )}

      {selectedRow && (
        <>
          <ApproveDialog
            open={approveOpen}
            onOpenChange={setApproveOpen}
            row={selectedRow}
            onSuccess={() => { refetch(); setApproveOpen(false); setSelectedRow(null); }}
          />
          <RejectDialog
            open={rejectOpen}
            onOpenChange={setRejectOpen}
            row={selectedRow}
            onSuccess={() => { refetch(); setRejectOpen(false); setSelectedRow(null); }}
          />
          <RescheduleDialog
            open={rescheduleOpen}
            onOpenChange={setRescheduleOpen}
            row={selectedRow}
            onSuccess={() => { refetch(); setRescheduleOpen(false); setSelectedRow(null); }}
          />
        </>
      )}
    </div>
  );
}

function ApproveDialog({
  open,
  onOpenChange,
  row,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: UpcomingRow;
  onSuccess: () => void;
}) {
  const [body, setBody] = useState<ApproveAppointmentBody>({
    appointment_date: row.appointment_date ?? "",
    clinic_id: row.clinic_id ?? 0,
    department_id: row.department_id ?? 0,
    doctor_id: row.doctor_id ?? 0,
    appointment_type: row.appointment_type ?? AppointmentTypeEnum.REGULAR_CHECKUP,
    scheduled_start_time: row.scheduled_start_time ?? "",
    notes: row.notes ?? null,
  });
  const approve = useApproveAppointment(row.id);
  const { user } = useAuth();
  const { data: clinicData } = useGetClinicsByStaff(user?.userId);
  const { data: deptData } = useGetDepartment(body.clinic_id);
  const { data: doctorData } = useGetDoctor(body.department_id);
  const { data: shiftData } = useGetDoctorShift(body.doctor_id, body.department_id);
  const doctorShiftSummary = getDoctorShiftSummary(shiftData as any, body.appointment_date, body.doctor_id);

  useEffect(() => {
    if (!open || !row) return;
    setBody({
      appointment_date: row.appointment_date ?? "",
      clinic_id: row.clinic_id ?? 0,
      department_id: row.department_id ?? 0,
      doctor_id: row.doctor_id ?? 0,
      appointment_type: row.appointment_type ?? AppointmentTypeEnum.REGULAR_CHECKUP,
      scheduled_start_time: row.scheduled_start_time ?? "",
      notes: row.notes ?? null,
    });
  }, [open, row]);

  useEffect(() => {
    const list = doctorData?.data ?? [];
    if (list.length === 0) return;
    const firstId = list[0]?.id;
    if (firstId == null) return;
    setBody((b) => {
      const valid = list.some((d: any) => Number(d.id) === Number(b.doctor_id));
      if (valid && b.doctor_id !== 0) return b;
      return { ...b, doctor_id: Number(firstId) };
    });
  }, [body.department_id, doctorData?.data?.length]);

  const handleSubmit = () => {
    approve.mutate({
      ...body,
      scheduled_start_time: formatTimeForApi(body.scheduled_start_time) || body.scheduled_start_time,
    } as any, { onSuccess });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve appointment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Clinic</Label>
            <select
              className="w-full border rounded-md h-9 px-2"
              value={body.clinic_id}
              onChange={(e) => setBody((b) => ({ ...b, clinic_id: Number(e.target.value), department_id: 0, doctor_id: 0 }))}
            >
              <option value={0}>Select clinic</option>
              {clinicData?.data?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Department</Label>
            <select
              className="w-full border rounded-md h-9 px-2"
              value={body.department_id}
              onChange={(e) => setBody((b) => ({ ...b, department_id: Number(e.target.value), doctor_id: 0 }))}
            >
              <option value={0}>Select department</option>
              {deptData?.data?.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Doctor</Label>
            <select
              className="w-full border rounded-md h-9 px-2"
              value={body.doctor_id}
              onChange={(e) => setBody((b) => ({ ...b, doctor_id: Number(e.target.value) }))}
            >
              <option value={0}>Select doctor</option>
              {doctorData?.data?.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Type</Label>
            <select
              className="w-full border rounded-md h-9 px-2"
              value={body.appointment_type}
              onChange={(e) => setBody((b) => ({ ...b, appointment_type: e.target.value }))}
            >
              {Object.values(AppointmentTypeEnum).map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Appointment date</Label>
            <Input
              type="date"
              value={body.appointment_date ?? ""}
              onChange={(e) => setBody((b) => ({ ...b, appointment_date: e.target.value }))}
            />
          </div>
          <div>
            <Label>Start time</Label>
            <Input
              type="time"
              value={body.scheduled_start_time}
              onChange={(e) => setBody((b) => ({ ...b, scheduled_start_time: e.target.value }))}
            />
          </div>
          {body.doctor_id && body.appointment_date && doctorShiftSummary && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <strong>Doctor availability ({DAY_NAMES[new Date(body.appointment_date + "T12:00:00").getDay()]}):</strong> {doctorShiftSummary}
              </div>
              {row.clinic_id && (
                <DoctorScheduleCard
                  doctorId={body.doctor_id}
                  date={body.appointment_date}
                  clinicId={row.clinic_id}
                  compact
                />
              )}
            </div>
          )}
          <div>
            <Label>Notes</Label>
            <Input
              value={body.notes ?? ""}
              onChange={(e) => setBody((b) => ({ ...b, notes: e.target.value || null }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={approve.isPending || !body.doctor_id || !body.appointment_date || isDoctorUnavailable(doctorShiftSummary)}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({
  open,
  onOpenChange,
  row,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: UpcomingRow;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const reject = useRejectAppointment(row.id);
  const handleSubmit = () => {
    const body: RejectAppointmentBody = { cancellation_reason: reason };
    reject.mutate(body as any, { onSuccess });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reject appointment</DialogTitle></DialogHeader>
        <div className="py-4">
          <Label>Cancellation reason</Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={reject.isPending || !reason.trim()}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RescheduleDialog({
  open,
  onOpenChange,
  row,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: UpcomingRow;
  onSuccess: () => void;
}) {
  const [body, setBody] = useState<RescheduleAppointmentBody>({
    appointment_date: row.appointment_date ?? "",
    scheduled_start_time: row.scheduled_start_time ?? "",
    notes: row.notes ?? null,
  });
  const reschedule = useRescheduleAppointment(row.id);
  const { data: shiftData } = useGetDoctorShift(row.doctor_id, row.department_id);
  const doctorShiftSummary = getDoctorShiftSummary(shiftData as any, body.appointment_date, row.doctor_id);

  const handleSubmit = () => {
    reschedule.mutate({
      ...body,
      scheduled_start_time: formatTimeForApi(body.scheduled_start_time) || body.scheduled_start_time,
    } as any, { onSuccess });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reschedule appointment</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={body.appointment_date}
              onChange={(e) => setBody((b) => ({ ...b, appointment_date: e.target.value }))}
            />
          </div>
          <div>
            <Label>Start time</Label>
            <Input
              type="time"
              value={body.scheduled_start_time}
              onChange={(e) => setBody((b) => ({ ...b, scheduled_start_time: e.target.value }))}
            />
          </div>
          {row.doctor_id && body.appointment_date && doctorShiftSummary && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <strong>Doctor availability ({DAY_NAMES[new Date(body.appointment_date + "T12:00:00").getDay()]}):</strong> {doctorShiftSummary}
              </div>
              {row.clinic_id && (
                <DoctorScheduleCard
                  doctorId={row.doctor_id}
                  date={body.appointment_date}
                  clinicId={row.clinic_id}
                  compact
                />
              )}
            </div>
          )}
          <div>
            <Label>Notes</Label>
            <Input
              value={body.notes ?? ""}
              onChange={(e) => setBody((b) => ({ ...b, notes: e.target.value || null }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={reschedule.isPending || !body.appointment_date || !body.scheduled_start_time || isDoctorUnavailable(doctorShiftSummary)}
          >
            Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
