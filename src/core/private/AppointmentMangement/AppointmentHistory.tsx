import { useState } from "react";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import { useGetAppointmentHistory } from "@/components/ApiCall/Api";
import Table, { Column } from "@/components/ui/table.tsx";
import { AppointmentTableExpandable } from "./AppointmentTableExpandable";

type HistoryRow = {
    id: number;
    patient_name?: string;
    patient_phone?: string;
    doctor_name?: string;
    department_name?: string;
    clinic_name?: string;
    appointment_date?: string;
    status?: string;
    appointment_created_by?: string | null;
    appointment_approved_by?: string | null;
    appointment_rescheduled_by?: string | null;
    appointment_cancelled_by?: string | null;
};

type HistoryFilters = {
    date_from?: string;
    date_to?: string;
    clinic_id?: string | number;
    department_id?: string | number;
    doctor_id?: string | number;
};

const AppointmentHistory = () => {
    const [filters, setFilters] = useState<HistoryFilters>({});

    const { data, isLoading } = useGetAppointmentHistory(
        filters.date_from,
        filters.date_to,
        filters.clinic_id,
        filters.department_id,
        filters.doctor_id,
    );

    const rows = (data?.data || []) as HistoryRow[];
    const columns: Column<HistoryRow>[] = [
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
        { header: "Status", accessor: "status", expandable: (row) => <AppointmentTableExpandable row={row} /> },
    ];

    return (
        <>
            <FilterAccordion
                title="Appointment Filters"
                dateRequired={true}
                onApply={({ range, values }) => {
                    setFilters({
                        date_from: range?.from,
                        date_to: range?.to,
                        clinic_id: values.clinicId,
                        department_id: values.departmentId,
                        doctor_id: values.doctorId,
                    });
                }}
                onReset={() => setFilters({})}
            >
                <AppointmentFilter />
            </FilterAccordion>

            <Table
                data={rows}
                columns={columns}
                loading={isLoading}
            />
        </>
    );
};

export default AppointmentHistory;