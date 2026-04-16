import {
  useGetDashboardAppointmentsChart,
  useGetDashboardSummary,
} from "@/components/ApiCall/Api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { DashboardTimeframe } from "./DashboardTypes";

const chartConfig = {
  count: { label: "Appointments", color: "hsl(221 83% 53%)" },
} satisfies ChartConfig;

interface AppointmentsBarChartProps {
  timeframe: DashboardTimeframe;
  clinicId: string | null;
}

export function AppointmentsBarChart({ timeframe, clinicId }: AppointmentsBarChartProps) {
  const { data: chartDataRes, isLoading } = useGetDashboardAppointmentsChart(
    timeframe,
    clinicId ?? undefined
  );
  const { data: summaryRes } = useGetDashboardSummary(timeframe, clinicId ?? undefined);
  const series = chartDataRes?.data ?? [];
  const summary = summaryRes?.data;

  const chartData =
    series.length > 0
      ? series.map((d) => ({ period: d.period, count: d.count }))
      : summary?.totalAppointments != null
        ? [{ period: "Total", count: summary.totalAppointments }]
        : [];

  return (
    <div className="space-y-4">
      <div className="h-[280px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 12, bottom: 24, left: 0 }}
          >
            <CartesianGrid strokeDasharray="2 2" vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={32} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="line" />}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48} fill="var(--color-count)" />
          </BarChart>
        </ChartContainer>
      </div>
      {!isLoading && chartData.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No appointment data for this period</p>
      )}
    </div>
  );
}
