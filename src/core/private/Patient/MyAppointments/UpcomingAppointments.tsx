import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Table, { Column } from "@/components/ui/table";
import { useGetPatientUpcomingAppointments } from "@/components/ApiCall/Api";
import { Appointment, AppointmentStatus } from "./appointmentTypes";
import { getStatusBadge } from "./utils";
import { AppointmentTableExpandable } from "@/core/private/AppointmentMangement/AppointmentTableExpandable";
import { Calendar, Clock, Building2, User, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UpcomingStatusTab = "REQUESTED" | "BOOKED" | "REJECTED";

export default function UpcomingAppointments() {
  const [status, setStatus] = useState<UpcomingStatusTab>("REQUESTED");

  const { data: requestedData, isLoading: requestedLoading } =
    useGetPatientUpcomingAppointments("REQUESTED");
  const { data: bookedData, isLoading: bookedLoading } =
    useGetPatientUpcomingAppointments("BOOKED");
  const { data: rejectedData, isLoading: rejectedLoading } =
    useGetPatientUpcomingAppointments("REJECTED");

  const appointmentsByStatus: Record<UpcomingStatusTab, Appointment[] | undefined> = {
    REQUESTED: requestedData?.data,
    BOOKED: bookedData?.data,
    REJECTED: rejectedData?.data,
  };
  const loadingByStatus: Record<UpcomingStatusTab, boolean> = {
    REQUESTED: requestedLoading,
    BOOKED: bookedLoading,
    REJECTED: rejectedLoading,
  };
  const appointments: Appointment[] = appointmentsByStatus[status] || [];
  const isLoading = loadingByStatus[status];

  const columns: Column<Appointment>[] = [
    {
      header: "Date",
      accessor: (appointment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{appointment.appointment_date ?? appointment.preferred_date ?? "—"}</span>
        </div>
      ),
    },
    {
      header: "Time",
      accessor: (appointment) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.scheduled_start_time ?? appointment.preferred_time ?? "—"}</span>
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: "patient_phone",
    },
    {
      header: "Clinic",
      accessor: (appointment) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.clinic_name || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: (appointment) =>
        appointment.department_name ? (
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.department_name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: "Doctor",
      accessor: (appointment) =>
        appointment.doctor_name ? (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.doctor_name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: "Status",
      accessor: (appointment) => getStatusBadge(appointment.status as AppointmentStatus),
      expandable: (appointment) => <AppointmentTableExpandable row={appointment} />,
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={status} onValueChange={(v) => setStatus(v as UpcomingStatusTab)}>
        <TabsList>
          <TabsTrigger value="REQUESTED">Requested</TabsTrigger>
          <TabsTrigger value="BOOKED">Booked</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg shadow-sm bg-card">
          <Table
            data={appointments}
            columns={columns}
            searchable={false}
            pagination={false}
            emptyText={`No ${status.toLowerCase()} appointments found.`}
          />
        </div>
      )}
    </div>
  );
}

