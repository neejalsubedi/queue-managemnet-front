import { useGetDashboardAppointmentTypes, useGetDashboardSummary } from "@/components/ApiCall/Api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, Legend } from "recharts";
import type { DashboardTimeframe } from "./DashboardTypes";
const COLORS = [
  "hsl(221 83% 53%)",
  "hsl(199 89% 48%)",
  "hsl(262 83% 58%)",
  "hsl(142 71% 45%)",
  "hsl(0 0% 65%)",
];

const chartConfig: ChartConfig = {
  count: { label: "Count" },
  counselling: { label: "Counselling", color: COLORS[0] },
  regular_checkup: { label: "Regular checkup", color: COLORS[1] },
  follow_up: { label: "Follow-up", color: COLORS[2] },
  operation: { label: "Operation", color: COLORS[3] },
  others: { label: "Others", color: COLORS[4] },
};

interface TopTypesDonutChartProps {
  timeframe: DashboardTimeframe;
  clinicId: string | null;
}

export function TopTypesDonutChart({ timeframe, clinicId }: TopTypesDonutChartProps) {
  const { data: typesRes } = useGetDashboardAppointmentTypes(
    timeframe,
    clinicId ?? undefined
  );
  const { data: summaryRes } = useGetDashboardSummary(timeframe, clinicId ?? undefined);
  const types = typesRes?.data ?? [];
  const summary = summaryRes?.data;

  const chartData =
    types.length > 0
      ? types.map((t, i) => ({
          name: t.label,
          value: t.count,
          fill: COLORS[i % COLORS.length],
        }))
      : summary?.totalAppointments != null && summary.totalAppointments > 0
        ? [
            { name: "Appointments", value: summary.totalAppointments, fill: COLORS[0] },
          ]
        : [];

  if (chartData.length === 0) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value) => [`${value}`, "Count"]}
              />
            }
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={chartData[i].fill} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
