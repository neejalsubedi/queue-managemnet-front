import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, CalendarCheck, UserCheck } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { DashboardSummary } from "./DashboardTypes";

const cards: Array<{
  key: keyof DashboardSummary;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  trendKey?: keyof DashboardSummary;
}> = [
  { key: "totalPatients", title: "Total Patients", icon: Users, trendKey: "totalPatientsTrendPercent" },
  { key: "totalDoctors", title: "Total Doctors", icon: Stethoscope, trendKey: "totalDoctorsTrendPercent" },
  { key: "totalAppointments", title: "Total Appointments", icon: CalendarCheck, trendKey: "totalAppointmentsTrendPercent" },
  { key: "completedToday", title: "Completed", icon: UserCheck, trendKey: "completedTrendPercent" },
];

interface SummaryStatCardsProps {
  data: DashboardSummary | null | undefined;
  isLoading?: boolean;
}

function TrendIndicator({ value }: { value: number | undefined }) {
  if (value == null) return null;
  const isUp = value >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isUp ? "text-green-600" : "text-red-600"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value)}%
    </span>
  );
}

export function SummaryStatCards({ data, isLoading }: SummaryStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, title, icon: Icon, trendKey }) => {
        let value = data?.[key];
        if (key === "totalAppointments" && value == null && data?.todayAppointments != null) {
          value = data.todayAppointments;
        }
        const trend = trendKey ? (data?.[trendKey] as number | undefined) : undefined;
        return (
          <Card key={key} className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-20 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {typeof value === "number" ? value : "—"}
                </p>
              )}
              <div className="mt-1">
                <TrendIndicator value={trend} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
