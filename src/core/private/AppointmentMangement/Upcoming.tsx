import { useState } from "react";
import { Column } from "jspdf-autotable";
import { FilterAccordion } from "@/components/ui/FilterAccordion";

import { useGetUpcomingAppointments } from "@/components/ApiCall/Api";
import Table from "@/components/ui/table.tsx";
import UpcomingAppointmentFilter from "@/core/private/AppointmentMangement/Filters/UpcomingFilter.tsx";

type UpcomingFilters = {
    date_from?: string;
    date_to?: string;
    clinic_id?: string | number;
    department_id?: string | number;
    doctor_id?: string | number;
    appointment_type?: string;
    patient_name?: string;
    status?: string;
};

const Upcoming = () => {
    const [filters, setFilters] = useState<UpcomingFilters>({});

    const { data, isLoading } = useGetUpcomingAppointments(
        filters.date_from,
        filters.date_to,
        filters.clinic_id,
        filters.department_id,
        filters.doctor_id,
        filters.appointment_type,
        filters.patient_name,
        filters.status,
    );

    const columns: Column[] = [
        { header: "Patient Name", dataKey: "patient_name" },
        { header: "Doctor", dataKey: "doctor_name" },
        { header: "Department", dataKey: "department_name" },
        { header: "Clinic", dataKey: "clinic_name" },
        { header: "Date", dataKey: "appointment_date" },
        { header: "Status", dataKey: "status" },
    ];

    return (
        <>
            <FilterAccordion
                title="Upcoming Appointment Filters"
                dateRequired={true}
                onApply={({ range, values }) => {
                    setFilters({
                        date_from: range?.from,
                        date_to: range?.to,
                        clinic_id: values.clinicId,
                        department_id: values.departmentId,
                        doctor_id: values.doctorId,
                        appointment_type: values.appointment_type,
                        patient_name: values.patient_name,
                        status: values.status,
                    });
                }}
                onReset={() => setFilters({})}
            >
                <UpcomingAppointmentFilter />
            </FilterAccordion>

            <Table
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
            />
        </>
    );
};

export default Upcoming;
