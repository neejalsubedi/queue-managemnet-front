import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Table, { Column } from "@/components/ui/table";
import { useGetPatientAppointmentHistory } from "@/components/ApiCall/Api";
import { Appointment, AppointmentStatus } from "./appointmentTypes";
import { getStatusBadge } from "./utils";
import { AppointmentTableExpandable } from "@/core/private/AppointmentMangement/AppointmentTableExpandable";
import { Calendar, Clock, Building2, User, Layers, Filter, AlertCircle, Hash, FileText, Tag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: AppointmentStatus.COMPLETED, label: "Completed" },
  { value: AppointmentStatus.REJECTED, label: "Rejected" },
  { value: AppointmentStatus.NO_SHOW, label: "No Show" },
  { value: AppointmentStatus.CANCELLED, label: "Cancelled" },
];

export default function AppointmentHistory() {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasSearched, setHasSearched] = useState(false);

  const shouldFetch = !!(hasSearched && dateFrom && dateTo);

  const { data, isLoading, refetch } = useGetPatientAppointmentHistory(
    dateFrom || undefined,
    dateTo || undefined,
    status && status !== "ALL" ? status : undefined,
    page,
    limit,
    shouldFetch
  );

  const appointments: Appointment[] = data?.data?.data || [];
  const paginationInfo = (data?.data as any)?.pagination;
  const totalItems = paginationInfo?.total ?? data?.data?.total ?? 0;

  const columns: Column<Appointment>[] = [
    {
      header: "Date",
      accessor: (appointment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {appointment.appointment_date || appointment.preferred_date || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Time",
      accessor: (appointment) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {appointment.scheduled_start_time || appointment.preferred_time || (
              <span className="text-muted-foreground">Not scheduled</span>
            )}
          </span>
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
      header: "Queue",
      accessor: (appointment) =>
        appointment.queue_number ? (
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{appointment.queue_number}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: "Type",
      accessor: (appointment) =>
        appointment.appointment_type ? (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs bg-muted px-2 py-1 rounded">
              {appointment.appointment_type.replace(/_/g, " ")}
            </span>
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
    {
      header: "Notes",
      accessor: (appointment) =>
        appointment.notes ? (
          <div className="flex items-start gap-2 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground line-clamp-2 break-words">
              {appointment.notes}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  const handleFilter = () => {
    if (!dateFrom || !dateTo) {
      return;
    }
    setHasSearched(true);
    setPage(1);
    refetch();
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setStatus("ALL");
    setPage(1);
    setHasSearched(false);
  };

  const isDateRangeValid = dateFrom && dateTo && dateFrom <= dateTo;

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!hasSearched && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select a date range to view appointment history. Both "Date From" and "Date To" are required.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">
                  Date From <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">
                  Date To <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  min={dateFrom}
                  required
                />
                {dateFrom && dateTo && dateFrom > dateTo && (
                  <p className="text-xs text-red-500 mt-1">
                    End date must be after start date
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleFilter}
                  className="flex-1"
                  disabled={!isDateRangeValid}
                >
                  Search
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {!hasSearched ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Date Range</h3>
            <p className="text-muted-foreground text-sm text-center max-w-sm">
              Please select a date range above and click "Search" to view your appointment history.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading appointment history...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-full min-w-0">
          <Table
            data={appointments}
            columns={columns}
            fitToViewport={true}
            searchable={false}
            pagination={true}
            showPageSize={true}
            emptyText="No appointment history found for the selected date range."
            totalItems={totalItems}
            page={page}
            itemsPerPage={limit}
            onPageChange={setPage}
            onItemsPerPageChange={setLimit}
          />
        </div>
      )}
    </div>
  );
}

