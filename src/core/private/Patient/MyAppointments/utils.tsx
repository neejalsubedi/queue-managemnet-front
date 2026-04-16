import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "./appointmentTypes";
import { cn } from "@/lib/utils";

export function getStatusBadge(status: AppointmentStatus) {
  const statusConfig = {
    [AppointmentStatus.REQUESTED]: {
      label: "Requested",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
    },
    [AppointmentStatus.REJECTED]: {
      label: "Rejected",
      className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    },
    [AppointmentStatus.BOOKED]: {
      label: "Booked",
      className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
    },
    [AppointmentStatus.CHECKED_IN]: {
      label: "Checked In",
      className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
    },
    [AppointmentStatus.IN_PROGRESS]: {
      label: "In Progress",
      className: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
    },
    [AppointmentStatus.COMPLETED]: {
      label: "Completed",
      className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
    },
    [AppointmentStatus.NO_SHOW]: {
      label: "No Show",
      className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
    },
    [AppointmentStatus.CANCELLED]: {
      label: "Cancelled",
      className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
    },
  };

  const config = statusConfig[status] || statusConfig[AppointmentStatus.REQUESTED];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

