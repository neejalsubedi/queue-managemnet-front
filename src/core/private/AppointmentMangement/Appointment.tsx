import { useState, useMemo } from "react";
import { FilterAccordion } from "@/components/ui/FilterAccordion";
import AppointmentFilter from "@/core/private/AppointmentMangement/AppointmentFilter";
import {

    useGetLiveAppointments,

} from "@/components/ApiCall/Api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Card,

    CardContent,
} from "@/components/ui/card";
import { AppointmentStatusEnum } from "@/enums/AppointmentEnum.ts";
import AppointmentCard from "@/core/private/AppointmentMangement/AppointmentCard.tsx";

/* ===== STATUS CONSTANT ===== */


/* ===== STATUS ORDER ===== */
const STATUS_ORDER: AppointmentStatusEnum[] = [
    AppointmentStatusEnum.IN_PROGRESS,
    AppointmentStatusEnum.CHECKED_IN,
    AppointmentStatusEnum.COMPLETED,
    AppointmentStatusEnum.BOOKED,
    AppointmentStatusEnum.REQUESTED,
    AppointmentStatusEnum.APPROVED,
    AppointmentStatusEnum.REJECTED,
    AppointmentStatusEnum.NO_SHOW,
    AppointmentStatusEnum.CANCELLED,
];

/* ===== PRIMARY VISIBLE STATUSES ===== */
const PRIMARY_STATUSES: AppointmentStatusEnum[] = [
    AppointmentStatusEnum.IN_PROGRESS,
    AppointmentStatusEnum.CHECKED_IN,
    AppointmentStatusEnum.COMPLETED,
    AppointmentStatusEnum.BOOKED,
];


/* ===== OTHER (COLLAPSIBLE) STATUSES ===== */
const OTHER_STATUSES = STATUS_ORDER.filter(
    (status) => !PRIMARY_STATUSES.includes(status)
);

/* ===== STATUS LABELS ===== */
const STATUS_LABEL: Record<AppointmentStatusEnum, string> = {
    [AppointmentStatusEnum.IN_PROGRESS]: "In Progress",
    [AppointmentStatusEnum.COMPLETED]: "Completed",
    [AppointmentStatusEnum.CHECKED_IN]: "Checked In",
    [AppointmentStatusEnum.BOOKED]: "Booked",
    [AppointmentStatusEnum.REQUESTED]: "Requested",
    [AppointmentStatusEnum.APPROVED]: "Approved",
    [AppointmentStatusEnum.REJECTED]: "Rejected",
    [AppointmentStatusEnum.NO_SHOW]: "No Show",
    [AppointmentStatusEnum.CANCELLED]: "Cancelled",
};


const Appointment = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<{
        clinicId?: string | number;
        departmentId?: string | number;
        doctorId?: string | number;
    }>({});

    const { data, isLoading, refetch } = useGetLiveAppointments(
        filters.clinicId,
        filters.departmentId,
        filters.doctorId
    );
    const [showOtherStatuses, setShowOtherStatuses] = useState(false);
    const getActionsForStatus = (status: AppointmentStatusEnum) => {
        switch (status) {
            case AppointmentStatusEnum.BOOKED:
                return ["CHECK_IN"];

            case AppointmentStatusEnum.CHECKED_IN:
                return ["START"];

            case AppointmentStatusEnum.IN_PROGRESS:
                return ["COMPLETE"];

            default:
                return [];
        }
    };

    /* ===== GROUP APPOINTMENTS BY STATUS ===== */
    const groupedAppointments = useMemo(() => {
        const list = data?.data || [];

        const grouped: Record<AppointmentStatusEnum, any[]> = {} as Record<
            AppointmentStatusEnum,
            any[]
        >;

        STATUS_ORDER.forEach((status) => (grouped[status] = []));

        list.forEach((item: any) => {
            const status: AppointmentStatusEnum = item.appointment.status;
            grouped[status]?.push(item);
        });

        return grouped;
    }, [data]);

    const hasAnyAppointments = useMemo(() => {
        return Object.values(groupedAppointments).some(
            (arr) => arr.length > 0
        );
    }, [groupedAppointments]);
    const renderStatusSection = (status: AppointmentStatusEnum) => {
        const items = groupedAppointments[status];
        if (!items?.length) return null;

        return (
            <div key={status} className="space-y-3">
                <h2 className="text-lg font-semibold">
                    {STATUS_LABEL[status]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: any) => (
                        <AppointmentCard
                            key={item.appointment.id}
                            appointment={item.appointment}
                            statusLabel={STATUS_LABEL}
                            onSuccess={refetch}
                        />
                    ))}


                </div>
            </div>
        );
    };

    return (
        <>
            {/* ===== FILTER ===== */}
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

            {/* ===== ADD BUTTON ===== */}
            <div className="flex justify-end mb-2">
                <Button
                    onClick={() =>
                        navigate("/appointment-management/book-appointment")
                    }
                >
                    Add Appointment
                </Button>
            </div>

            {/* ===== CONTENT ===== */}
            {isLoading && <p className="text-center">Loading appointments...</p>}

            {!isLoading && !hasAnyAppointments && (
                <Card className="text-center">
                    <CardContent className="py-12 text-muted-foreground">
                        No current appointments
                    </CardContent>
                </Card>
            )}

            {/* ===== STATUS SECTIONS ===== */}
            {/* ===== PRIMARY STATUSES ===== */}
            {!isLoading &&
                hasAnyAppointments &&
                PRIMARY_STATUSES.map(renderStatusSection)}

            {/* ===== COLLAPSIBLE OTHER STATUSES ===== */}
            {!isLoading &&
                hasAnyAppointments &&
                OTHER_STATUSES.some(
                    (status) => groupedAppointments[status]?.length > 0
                ) && (
                    <div className="pt-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowOtherStatuses((prev) => !prev)}
                        >
                            {showOtherStatuses ? "Hide other statuses" : "Show other statuses"}
                        </Button>

                        {showOtherStatuses && (
                            <div className="mt-6 space-y-6">
                                {OTHER_STATUSES.map(renderStatusSection)}
                            </div>
                        )}
                    </div>
                )}

        </>
    );
};

export default Appointment;
