import { useState } from "react";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import { useGetLiveAppointments } from "@/components/ApiCall/Api";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

const Appointment = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<{
        clinicId?: string | number;
        departmentId?: string | number;
        doctorId?: string | number;
    }>({});

    const { data, refetch, isLoading } = useGetLiveAppointments(
        filters.clinicId,
        filters.departmentId,
        filters.doctorId
    );

    return (
        <div>
            <FilterAccordion
                title="Appointment Filters"
                dateRequired={false}
                onApply={({ values }) => {
                    setFilters({
                        clinicId: values.clinicId,
                        departmentId: values.departmentId,
                        doctorId: values.doctorId,
                    });


                }}
            >
                <AppointmentFilter />
            </FilterAccordion>
<div className={"flex justify-end"}><Button onClick={()=>navigate("/appointment-management/book-appointment")}>Add Appointment </Button></div>
            {/* Appointments List */}
            <div className="mt-4">
                {isLoading && <p>Loading...</p>}
                {data?.data?.map((item: any) => (
                    <div key={item.id}>{item.patientName}</div>
                ))}
            </div>
        </div>
    );
};

export default Appointment;
