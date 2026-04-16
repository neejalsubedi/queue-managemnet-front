import { useState, useMemo } from "react";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import {
  useGetUpcomingAppointments,
  useFollowUpAppointment,
  useGetDoctorShift,
} from "@/components/ApiCall/Api";
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
import type { FollowUpAppointmentBody } from "../types";
import { DAY_NAMES, formatTimeForApi, getDoctorShiftSummary, isDoctorUnavailable } from "../doctorAvailability";
import { DoctorScheduleCard } from "../DoctorScheduleCard";
import { AppointmentTableExpandable } from "../AppointmentTableExpandable";

type CompletedRow = {
  id: number;
  patient_name?: string;
  patient_phone?: string;
  doctor_name?: string;
  department_name?: string;
  department_id?: number;
  clinic_name?: string;
  appointment_date?: string;
  scheduled_start_time?: string;
  status?: string;
  appointment_type?: string;
  doctor_id?: number;
  appointment_created_by?: string | null;
  appointment_approved_by?: string | null;
  appointment_rescheduled_by?: string | null;
  appointment_cancelled_by?: string | null;
};

export default function CompletedTab() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{
    date_from?: string;
    date_to?: string;
    clinic_id?: number;
    department_id?: string | number;
    doctor_id?: string | number;
    page?: number;
    limit?: number;
  }>({ page: 1, limit: 10 });
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CompletedRow | null>(null);

  const { data, isLoading } = useGetUpcomingAppointments({
    date_from: filters.date_from,
    date_to: filters.date_to,
    status: "COMPLETED",
    clinic_id: filters.clinic_id,
    department_id: filters.department_id,
    doctor_id: filters.doctor_id,
    page: filters.page,
    limit: filters.limit,
  });

  const rows = useMemo(() => {
    const inner = (data as any)?.data;
    const list = Array.isArray(inner?.data) ? inner.data : Array.isArray(inner) ? inner : [];
    return (list as CompletedRow[]).filter((r) => r.status === "COMPLETED");
  }, [data]);
  const pagination = (data as any)?.data?.pagination;
  const totalItems = pagination?.total ?? rows.length;

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.APPOINTMENT.UPCOMING] });
  };

  const columns: Column<CompletedRow>[] = useMemo(
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
      { header: "Type", accessor: "appointment_type", expandable: (row) => <AppointmentTableExpandable row={row} /> },
      {
        header: "Actions",
        accessor: (row) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedRow(row);
              setFollowUpOpen(true);
            }}
          >
            Follow Up
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <FilterAccordion
        title="Filters"
        dateRequired={false}
        onApply={({ range, values }) =>
          setFilters((prev) => ({
            ...prev,
            date_from: range?.from,
            date_to: range?.to,
            clinic_id: values.clinicId,
            department_id: values.departmentId,
            doctor_id: values.doctorId,
            page: 1,
          }))
        }
        onReset={() => setFilters({ page: 1, limit: 10 })}
      >
        <AppointmentFilter />
      </FilterAccordion>

      <Table<CompletedRow>
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

      {selectedRow && (
        <FollowUpDialog
          open={followUpOpen}
          onOpenChange={setFollowUpOpen}
          row={selectedRow}
          onSuccess={() => {
            refetch();
            setFollowUpOpen(false);
            setSelectedRow(null);
          }}
        />
      )}
    </div>
  );
}

function FollowUpDialog({
  open,
  onOpenChange,
  row,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: CompletedRow;
  onSuccess: () => void;
}) {
  const [body, setBody] = useState<FollowUpAppointmentBody>({
    appointment_date: "",
    scheduled_start_time: "",
    appointment_type: "FOLLOW_UP",
    notes: null,
    doctor_id: row.doctor_id ?? undefined,
  });
  const followUp = useFollowUpAppointment(row.id);
  const effectiveDoctorId = body.doctor_id ?? row.doctor_id;
  const { data: shiftData } = useGetDoctorShift(effectiveDoctorId, row.department_id);
  const doctorShiftSummary = getDoctorShiftSummary(shiftData as any, body.appointment_date, effectiveDoctorId);

  const handleSubmit = () => {
    followUp.mutate({
      ...body,
      scheduled_start_time: formatTimeForApi(body.scheduled_start_time) || body.scheduled_start_time,
    } as any, { onSuccess });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Schedule follow-up</DialogTitle></DialogHeader>
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
          {effectiveDoctorId && row.department_id && body.appointment_date && doctorShiftSummary && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <strong>Doctor availability ({DAY_NAMES[new Date(body.appointment_date + "T12:00:00").getDay()]}):</strong> {doctorShiftSummary}
              </div>
              {row.clinic_id && (
                <DoctorScheduleCard
                  doctorId={effectiveDoctorId}
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
            disabled={followUp.isPending || !body.appointment_date || !body.scheduled_start_time || isDoctorUnavailable(doctorShiftSummary)}
          >
            Create follow-up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
