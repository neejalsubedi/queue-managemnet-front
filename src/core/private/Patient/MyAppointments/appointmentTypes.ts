// Appointment Status Enum
export enum AppointmentStatus {
  REQUESTED = "REQUESTED",
  REJECTED = "REJECTED",
  BOOKED = "BOOKED",
  CHECKED_IN = "CHECKED_IN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED",
}

// Clinic Type
export interface Clinic {
  id: number;
  name: string;
  address?: string;
  contact?: string;
}

// Preferred Time Enum
export const PREFERRED_TIME = Object.freeze({
  Morning: "MORNING",
  Afternoon: "AFTERNOON",
  Evening: "EVENING",
  Any: "ANY",
});

// Doctor Type
export interface Doctor {
  id: number;
  name: string;
  department_id: number;
  department_name?: string;
  clinic_id?: number;
  clinic_name?: string;
  email?: string;
  phone?: string;
  start_time?: string | null;
  end_time?: string | null;
  is_day_off?: boolean | null;
}

// Appointment Type
export interface Appointment {
  id: number;
  patient_id?: number;
  patient_name?: string;
  patient_phone?: string;
  preferred_date?: string; // For booking/upcoming
  preferred_time?: string; // For booking/upcoming
  appointment_date?: string; // For history
  scheduled_start_time?: string | null; // For history
  status: AppointmentStatus;
  clinic_id: number;
  clinic_name?: string | null;
  department_id?: number | null;
  department_name?: string | null;
  doctor_id?: number | null;
  doctor_name?: string | null;
  queue_number?: number | null;
  appointment_type?: string;
  notes?: string | null;
  cancellation_reason?: string | null;
  checked_in_time?: string | null;
  actual_start_time?: string | null;
  actual_end_time?: string | null;
  is_walk_in?: boolean;
  created_at?: string;
  updated_at?: string;
  appointment_created_by?: string | null;
  appointment_approved_by?: string | null;
  appointment_cancelled_by?: string | null;
  appointment_rescheduled_by?: string | null;
}

// Booking Request Type
export interface BookAppointmentRequest {
  preferred_date: string;
  clinic_id: number;
  preferred_time: "MORNING" | "AFTERNOON" | "EVENING" | "ANY";
  department_id?: number;
  doctor_id?: number;
  notes: string; // Required field
}

// API Response Types
export interface ApiListResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
}

export interface ApiPaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: {
    data: T[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    total?: number; // Fallback for different API structures
    page?: number;
    limit?: number;
  };
}

export interface ApiSingleResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

