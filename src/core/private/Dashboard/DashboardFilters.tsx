import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { useGetClinicsByStaff } from "@/components/ApiCall/Api";
import type { DashboardTimeframe } from "./DashboardTypes";

const TIMEFRAME_OPTIONS: { value: DashboardTimeframe; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

interface DashboardFiltersProps {
  timeframe: DashboardTimeframe;
  clinicId: string | null;
  onTimeframeChange: (value: DashboardTimeframe) => void;
  onClinicChange: (value: string | null) => void;
}

export function DashboardFilters({
  timeframe,
  clinicId,
  onTimeframeChange,
  onClinicChange,
}: DashboardFiltersProps) {
  const { user } = useAuth();
  const { data: clinicsData } = useGetClinicsByStaff(user?.userId);
  const clinics = clinicsData?.data ?? [];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={timeframe}
        onValueChange={(v) => onTimeframeChange(v as DashboardTimeframe)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Time range" />
        </SelectTrigger>
        <SelectContent>
          {TIMEFRAME_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={clinicId ?? "all"}
        onValueChange={(v) => onClinicChange(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Clinic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All clinics</SelectItem>
          {clinics.map((c: { id: number; name: string }) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
