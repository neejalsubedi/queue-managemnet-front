import {
  useGetDashboardApprovalRequests,
  useApproveAppointment,
  useRejectAppointment,
} from "@/components/ApiCall/Api";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function formatDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d)
      .toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" })
      .replace(/-/g, ".");
  } catch {
    return String(d);
  }
}

const MAX_ITEMS = 4;

interface ApprovalRequestsCardProps {
  clinicId?: string | null;
}

export function ApprovalRequestsCard({ clinicId }: ApprovalRequestsCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetDashboardApprovalRequests(clinicId);

  const requests = (data?.data ?? []).slice(0, MAX_ITEMS);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.DASHBOARD.GET_APPROVAL_REQUESTS],
    });
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Approval requests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-md" />
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending approval requests</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((r) => (
              <ApprovalRow
                key={r.id}
                id={r.id}
                patientName={r.patient_name}
                date={formatDate(r.appointment_date)}
                preferredTime={r.preferred_time}
                notes={r.notes}
                clinicName={r.clinic_name}
                doctorName={r.doctor_name}
                onApprove={invalidate}
                onReject={invalidate}
                onView={() => navigate("/appointment-management")}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ApprovalRow({
  id,
  patientName,
  date,
  preferredTime,
  notes,
  clinicName,
  doctorName,
  onApprove,
  onReject,
  onView,
}: {
  id: number;
  patientName: string;
  date: string;
  preferredTime?: string;
  notes?: string | null;
  clinicName?: string;
  doctorName?: string;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
}) {
  const approve = useApproveAppointment(id);
  const reject = useRejectAppointment(id);

  const handleApprove = async () => {
    await approve.mutateAsync({});
    onApprove();
  };
  const handleReject = async () => {
    await reject.mutateAsync({});
    onReject();
  };

  const subtitle = [date, preferredTime, clinicName, doctorName].filter(Boolean).join(" · ");

  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{patientName}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle || "—"}</p>
        {notes ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{notes}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {/* <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
          onClick={handleReject}
          disabled={reject.isPending}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
          onClick={handleApprove}
          disabled={approve.isPending}
        >
          <Check className="h-4 w-4" />
        </Button> */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={onView}
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

