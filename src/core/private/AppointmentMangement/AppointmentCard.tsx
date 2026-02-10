import {
    useCheckInAppointment,
    useStartAppointment,
    useCompleteAppointment, useFollowUpAppointment,
} from "@/components/ApiCall/Api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    AppointmentStatusEnum,
    AppointmentTypeEnum,
} from "@/enums/AppointmentEnum";

type Props = {
    appointment: any;
    onSuccess: () => void;
    statusLabel: Record<AppointmentStatusEnum, string>;
};

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

const AppointmentCard = ({ appointment: appt, onSuccess, statusLabel }: Props) => {
    const checkInMutation = useCheckInAppointment(appt.id);
    const startMutation = useStartAppointment(appt.id);
    const completeMutation = useCompleteAppointment(appt.id);

    const actions = getActionsForStatus(appt.status);
    const followUpMutation = useFollowUpAppointment(appt.id);

    const handleFollowUp = () => {
        followUpMutation.mutate(
            {},
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            }
        );
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    {appt.patient_name}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <div>
                    <strong>Queue:</strong> {appt.queue_number}
                </div>

                <div>
                    <strong>Type:</strong>{" "}
                    {AppointmentTypeEnum[appt.appointment_type as AppointmentTypeEnum]}
                </div>

                <div>
                    <strong>Time:</strong> {appt.scheduled_start_time}
                </div>

                <div>
                    <strong>Status:</strong> {statusLabel[appt.status]}
                </div>


                {actions.length > 0 && (
                    <div className="flex gap-2 pt-2">
                        {actions.includes("CHECK_IN") && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    checkInMutation.mutate({}, { onSuccess })
                                }
                                disabled={checkInMutation.isPending}
                            >
                                Check In
                            </Button>
                        )}

                        {actions.includes("START") && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    startMutation.mutate({}, { onSuccess })
                                }
                                disabled={startMutation.isPending}
                            >
                                Start
                            </Button>
                        )}

                        {actions.includes("COMPLETE") && (
                            <Button
                                size="sm"
                                variant="success"
                                onClick={() =>
                                    completeMutation.mutate({}, { onSuccess })
                                }
                                disabled={completeMutation.isPending}
                            >
                                Complete
                            </Button>
                        )}
                        {appt.status === AppointmentStatusEnum.COMPLETED && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleFollowUp}
                                    disabled={followUpMutation.isPending}
                            >
                                Follow Up
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AppointmentCard;
