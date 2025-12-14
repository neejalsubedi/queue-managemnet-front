export interface GetDashboardHeaderDataResponse {
  statusCode: number;
  message: string;
  data: DashboardHeader;
}

export interface DashboardHeader {
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  vatAmount: number;
  productStock: number;
  activePatients: number;
  lowStock: number;
  outOfStock: number;
  todaySalesTrend: DashboardStat;
  weeklySalesTrend: DashboardStat;
  monthlySalesTrend: DashboardStat;
}

export enum DashboardStat {
  Positive = "POSITIVE",
  Negative = "NEGATIVE",
  Neutral = "NEUTRAL",
}
