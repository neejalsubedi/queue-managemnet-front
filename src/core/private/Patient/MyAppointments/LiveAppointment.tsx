import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Building2, User, Layers, FileText, MapPin, Hash } from "lucide-react";
import { useGetPatientLiveAppointment } from "@/components/ApiCall/Api";
import { AppointmentStatus } from "./appointmentTypes";
import { getStatusBadge } from "./utils";

const ACTIVE_STATUSES = ["BOOKED", "CHECKED_IN", "IN_PROGRESS"];

function LiveAppointmentCard({
  item,
  isActive,
}: {
  item: { appointment: any; prediction: any };
  isActive?: boolean;
}) {
  const appt = item.appointment ?? item;
  const prediction = item.prediction;

  return (
    <Card className={isActive ? "ring-2 ring-primary bg-primary/5" : ""}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isActive ? "Current appointment" : "Appointment"}
            </h3>
            {getStatusBadge(appt.status as AppointmentStatus)}
          </div>
          {appt.queue_number != null && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span className="font-medium tabular-nums">#{appt.queue_number}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{appt.appointment_date ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{appt.scheduled_start_time ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clinic</p>
              <p className="font-medium">{appt.clinic_name ?? "—"}</p>
            </div>
          </div>

          {appt.clinic_address && (
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{appt.clinic_address}</p>
              </div>
            </div>
          )}

          {appt.department_name && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{appt.department_name}</p>
              </div>
            </div>
          )}

          {appt.doctor_name && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p className="font-medium">{appt.doctor_name}</p>
              </div>
            </div>
          )}

          {appt.appointment_type && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{appt.appointment_type.replace(/_/g, " ")}</p>
              </div>
            </div>
          )}
        </div>

        {prediction && (prediction.predicted_wait_minutes != null || prediction.my_position != null) && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm font-medium mb-2">Wait time</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {prediction.predicted_wait_minutes != null && (
                <span className="tabular-nums">
                  Est. wait: <strong>{prediction.predicted_wait_minutes} min</strong>
                </span>
              )}
              {prediction.my_position != null && (
                <span className="tabular-nums">
                  Position in queue: <strong>{prediction.my_position}</strong>
                </span>
              )}
              {prediction.confidence && (
                <span>Confidence: {prediction.confidence}</span>
              )}
            </div>
            {prediction.explanation?.patients_ahead != null && (
              <p className="text-xs text-muted-foreground mt-2">
                {prediction.explanation.patients_ahead} patient(s) ahead of you
              </p>
            )}
          </div>
        )}

        {(appt.checked_in_time ?? appt.actual_start_time ?? appt.actual_end_time) && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            {appt.checked_in_time && (
              <div>
                <p className="text-muted-foreground">Checked in</p>
                <p className="font-medium">{appt.checked_in_time}</p>
              </div>
            )}
            {appt.actual_start_time && (
              <div>
                <p className="text-muted-foreground">Started</p>
                <p className="font-medium">{appt.actual_start_time}</p>
              </div>
            )}
            {appt.actual_end_time && (
              <div>
                <p className="text-muted-foreground">Ended</p>
                <p className="font-medium">{appt.actual_end_time}</p>
              </div>
            )}
          </div>
        )}

        {(appt.appointment_created_by ?? appt.appointment_approved_by ?? appt.appointment_rescheduled_by ?? appt.appointment_cancelled_by) && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
            {appt.appointment_created_by && (
              <div>
                <p className="text-muted-foreground">Created by</p>
                <p className="font-medium">{appt.appointment_created_by}</p>
              </div>
            )}
            {appt.appointment_approved_by && (
              <div>
                <p className="text-muted-foreground">Approved by</p>
                <p className="font-medium">{appt.appointment_approved_by}</p>
              </div>
            )}
            {appt.appointment_rescheduled_by && (
              <div>
                <p className="text-muted-foreground">Rescheduled by</p>
                <p className="font-medium">{appt.appointment_rescheduled_by}</p>
              </div>
            )}
            {appt.appointment_cancelled_by && (
              <div>
                <p className="text-muted-foreground">Cancelled by</p>
                <p className="font-medium">{appt.appointment_cancelled_by}</p>
              </div>
            )}
          </div>
        )}

        {appt.notes && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{appt.notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LiveAppointment() {
  const { data, isLoading, refetch } = useGetPatientLiveAppointment();
  const rawData = data?.data;
  const list = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading live appointment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (list.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Live Appointment</h3>
          <p className="text-muted-foreground text-sm text-center max-w-sm">
            You don&apos;t have any active appointment at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeIndex = list.findIndex(
    (item: any) => ACTIVE_STATUSES.includes((item.appointment ?? item).status)
  );
  const primaryIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeItem = list[primaryIndex];
  const otherItems = list.filter((_, i) => i !== primaryIndex);

  const normalize = (item: any) =>
    item?.appointment != null
      ? { appointment: item.appointment, prediction: item.prediction ?? null }
      : { appointment: item, prediction: null };

  return (
    <div className="space-y-6">
      <LiveAppointmentCard item={normalize(activeItem)} isActive={activeIndex >= 0} />
      {otherItems.map((item: any, idx: number) => (
        <LiveAppointmentCard
          key={(item.appointment ?? item).id ?? idx}
          item={normalize(item)}
        />
      ))}
    </div>
  );
}
