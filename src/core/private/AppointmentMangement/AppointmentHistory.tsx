import { useState } from "react";
import { Column } from "jspdf-autotable";

import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import { useGetAppointmentHistory } from "@/components/ApiCall/Api";
import Table from "@/components/ui/table.tsx";


type HistoryFilters = {
    date_from?: string;
    date_to?: string;
    clinic_id?: string | number;
    department_id?: string | number;
    doctor_id?: string | number;
};

const AppointmentHistory = () => {
    const [filters, setFilters] = useState<HistoryFilters>({});

    // 🔥 Pass filters directly to API
    const { data, isLoading } = useGetAppointmentHistory(
        filters.date_from,
        filters.date_to,
        filters.clinic_id,
        filters.department_id,
        filters.doctor_id,
    );

    const columns: Column[] = [
        {
            header: "Patient Name",
            dataKey: "patient_name",
        },
        {
            header: "Doctor",
            dataKey: "doctor_name",
        },
        {
            header: "Department",
            dataKey: "department_name",
        },
        {
            header: "Clinic",
            dataKey: "clinic_name",
        },
        {
            header: "Date",
            dataKey: "appointment_date",
        },
        {
            header: "Status",
            dataKey: "status",
        },
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
                data={data?.data || []}
                columns={columns}
                loading={isLoading}

            />
        </>
    );
};

export default AppointmentHistory;
