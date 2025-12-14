import { useApiGet } from "@/components/ApiCall/ApiGet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/hooks/useBranches";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import { useDashboardContext } from "@/components/ContextApi/DashboardProvider";
import {
  DashboardStat,
  GetDashboardHeaderDataResponse,
} from "./DashboardTypes";

export default function Dashboard() {
  const [branchId, setBranchId] = useState<number | null>(null);
  const { branches, branchLoading } = useBranches();
  const { setLowStock, setOutOfStock } = useDashboardContext();

  useEffect(() => {
    if (branches.length > 0 && branchId === null) {
      setBranchId(branches[0].value);
    }
  }, [branches]);

  const isQueryEnabled = branchId !== null;

  const { data: fetchedHeaderData } = useApiGet<GetDashboardHeaderDataResponse>(
    QUERY_KEYS.GET_DASHBOARD_HEADER_DATA(branchId),
    {
      retry: 0,
      enabled: isQueryEnabled,
    }
  );

  useEffect(() => {
    if (fetchedHeaderData?.data) {
      setLowStock(fetchedHeaderData.data.lowStock);
      setOutOfStock(fetchedHeaderData.data.outOfStock);
    }
  }, [fetchedHeaderData]);

  const stats = [
    {
      title: "Today's Sales",
      value: fetchedHeaderData?.data?.todaySales,
      // change: "+12% from yesterday",
      icon: ShoppingCart,
      trend: fetchedHeaderData?.data?.todaySalesTrend,
    },
    {
      title: "Monthly Revenue",
      value: fetchedHeaderData?.data?.monthlySales,
      // change: "+18% from last month",
      icon: TrendingUp,
      trend: fetchedHeaderData?.data?.monthlySalesTrend,
    },
    {
      title: "Weekly Revenue",
      value: fetchedHeaderData?.data?.weeklySales,
      // change: "Within next 30 days",
      icon: TrendingUp,
      trend: fetchedHeaderData?.data?.weeklySalesTrend,
    },
    {
      title: "Products in Stock",
      value: fetchedHeaderData?.data?.productStock,
      // change: "23 low stock items",
      icon: Package,
      // trend: "warning",
    },
    {
      title: "Active Patients",
      value: fetchedHeaderData?.data?.activePatients,
      // change: "+5 new today",
      icon: Users,
      // trend: "up",
    },
    {
      title: "VAT Collected",
      value: fetchedHeaderData?.data?.vatAmount,
      // change: "13% VAT this month",
      icon: DollarSign,
      // trend: "neutral",
    },
  ];

  const getTrendColor = (trend: string | undefined) => {
    switch (trend) {
      case DashboardStat.Positive:
        return "text-success";
      case DashboardStat.Negative:
        return "text-warning";
      case DashboardStat.Neutral:
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendBg = (trend: string | undefined) => {
    switch (trend) {
      case DashboardStat.Positive:
        return "bg-success-light";
      case DashboardStat.Negative:
        return "bg-warning-light";
      case DashboardStat.Neutral:
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Appointment & Queue Management System
          </p>
        </div>
        <div className="w-64">
          {" "}
          <Select
            value={branchId !== null ? String(branchId) : undefined}
            onValueChange={(value) => setBranchId(Number(value))}
            disabled={branchLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={String(branch.value)}>
                  {branch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={stat.title}
              className="bg-gradient-card border-border shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${getTrendBg(stat.trend)}`}>
                  <IconComponent
                    className={`h-4 w-4 ${getTrendColor(stat.trend)}`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(stat.value ?? 0)}
                </div>
                {/* <p className={`text-xs ${getTrendColor(stat.trend)} mt-1`}>
                  {stat.change}
                </p> */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
