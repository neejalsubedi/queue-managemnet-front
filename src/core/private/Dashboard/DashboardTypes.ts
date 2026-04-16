/** Backend dashboard summary response - ready for API consumption */
export interface DashboardSummaryResponse {
  statusCode: number;
  message: string;
  data: DashboardSummary;
}

export type DashboardTimeframe = "daily" | "weekly" | "monthly" | "yearly";

export interface DashboardSummary {
  totalPatients: number;
  totalClinics: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments?: number;
  pendingRequests: number;
  completedToday: number;
  inProgressNow?: number;
  checkedInNow?: number;
  /** Optional trend % for stat cards (e.g. 6 for "6% up") */
  totalPatientsTrendPercent?: number;
  totalDoctorsTrendPercent?: number;
  totalAppointmentsTrendPercent?: number;
  completedTrendPercent?: number;
}

/** For bar chart: appointments over time (period label + count) */
export interface DashboardChartSeriesItem {
  period: string;
  count: number;
  /** Optional: breakdown by type */
  consultation?: number;
  procedure?: number;
}

/** For donut: appointment type distribution */
export interface DashboardAppointmentTypeItem {
  type: string;
  label: string;
  count: number;
  percent: number;
}

/** Approval request item from GET /api/dashboard/approval-requests */
export interface DashboardApprovalRequest {
  id: number;
  appointment_date: string;
  preferred_time: string;
  notes: string | null;
  created_at: string;
  patient_name: string;
  clinic_name: string;
  doctor_name: string;
}

/** Doctor at work item from GET /api/dashboard/doctors-at-work */
export interface DashboardDoctorAtWork {
  id: number;
  name: string;
  shift?: string;
  patient_count: number;
  status?: string;
}

/** Optional trend for stat cards (if backend provides later) */
export enum DashboardStat {
  Positive = "POSITIVE",
  Negative = "NEGATIVE",
  Neutral = "NEUTRAL",
}

/** Legacy type for old dashboard header - kept for backward compatibility if needed */
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
