import { useState } from "react";
import { useGetDashboardSummary } from "@/components/ApiCall/Api";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardFilters } from "./DashboardFilters";
import { SummaryStatCards } from "./SummaryStatCards";
import { AppointmentsBarChart } from "./AppointmentsBarChart";
import { TopTypesDonutChart } from "./TopTypesDonutChart";
import { DoctorsAtWorkCard } from "./DoctorsAtWorkCard";
import { ApprovalRequestsCard } from "./ApprovalRequestsCard";
import type { DashboardTimeframe } from "./DashboardTypes";

export default function Dashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<DashboardTimeframe>("weekly");
  const [clinicId, setClinicId] = useState<string | null>(null);

  const { data: summaryData, isLoading: summaryLoading } = useGetDashboardSummary(
    timeframe,
    clinicId
  );
  const summary = summaryData?.data ?? null;

  const welcomeName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "User";

  return (
    <div className="space-y-6">
      {/* Header: Welcome + Global filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {welcomeName}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here’s an overview of your clinic
          </p>
        </div>
        <DashboardFilters
          timeframe={timeframe}
          clinicId={clinicId}
          onTimeframeChange={setTimeframe}
          onClinicChange={setClinicId}
        />
      </div>

      {/* Top row: 4 summary cards */}
      <SummaryStatCards data={summary} isLoading={summaryLoading} />

      {/* Middle row: Bar chart + Donut chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsBarChart timeframe={timeframe} clinicId={clinicId} />
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top appointment types</CardTitle>
          </CardHeader>
          <CardContent>
            <TopTypesDonutChart timeframe={timeframe} clinicId={clinicId} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Doctors at work, Approval requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DoctorsAtWorkCard clinicId={clinicId} />
        <ApprovalRequestsCard clinicId={clinicId} />
      </div>
    </div>
  );
}
