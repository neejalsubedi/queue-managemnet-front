import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import { useGetAppointmentHistory } from "@/components/ApiCall/Api";
import Table, { Column } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AppointmentTypeEnum } from "@/enums/AppointmentEnum";
import { AppointmentTableExpandable } from "../AppointmentTableExpandable";

type HistoryRow = {
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
  appointment_created_by?: string | null;
  appointment_approved_by?: string | null;
  appointment_rescheduled_by?: string | null;
  appointment_cancelled_by?: string | null;
};

function HistoryStatusFilter() {
  const { register } = useFormContext();
  return (
    <div>
      <Label>Status (optional)</Label>
      <select className="w-full border rounded-md h-10 px-3" {...register("status")}>
        <option value="">All</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
        <option value="NO_SHOW">NO_SHOW</option>
        <option value="REJECTED">REJECTED</option>
      </select>
    </div>
  );
}

function HistoryAppointmentTypeFilter() {
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

function HistoryPatientNameFilter() {
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

export default function HistoryTab() {
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filters, setFilters] = useState<{
    date_from?: string;
    date_to?: string;
    clinic_id?: string | number;
    department_id?: string | number;
    doctor_id?: string | number;
    appointment_type?: string;
    patient_name?: string;
    status?: string;
    page?: number;
    limit?: number;
  }>({ page: 1, limit: 10 });

  const { data, isLoading } = useGetAppointmentHistory(
    filters.date_from,
    filters.date_to,
    filters.clinic_id,
    filters.department_id,
    filters.doctor_id,
    filters.appointment_type,
    filters.patient_name,
    filters.status,
    filters.page,
    filters.limit,
    filtersApplied
  );

  const rows = useMemo(() => {
    if (!filtersApplied || !data) return [];
    const inner = (data as any)?.data;
    const list = Array.isArray(inner?.data) ? inner.data : Array.isArray(inner) ? inner : [];
    return list as HistoryRow[];
  }, [data, filtersApplied]);
  const pagination = (data as any)?.data?.pagination;
  const totalItems = pagination?.total ?? rows.length;

  const columns: Column<HistoryRow>[] = useMemo(
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
    ],
    []
  );

  return (
    <div className="space-y-4">
      <FilterAccordion
        title="Filters"
        dateRequired={true}
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
        <AppointmentFilter />
        <HistoryStatusFilter />
        <HistoryAppointmentTypeFilter />
        <HistoryPatientNameFilter />
      </FilterAccordion>

      {!filtersApplied && (
        <div className="rounded-lg border bg-muted/30 py-12 text-center text-muted-foreground">
          Select a date range and apply filters to load appointment history.
        </div>
      )}

      {filtersApplied && (
        <Table<HistoryRow>
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
    </div>
  );
}
