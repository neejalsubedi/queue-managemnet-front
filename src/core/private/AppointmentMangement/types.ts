/** Appointment list/history item (API row) */
export interface AppointmentRow {
  id: number;
  patient_id?: number;
  patient_name?: string;
  patient_phone?: string;
  appointment_date?: string;
  scheduled_start_time?: string | null;
  status: string;
  clinic_id?: number;
  clinic_name?: string | null;
  department_id?: number | null;
  department_name?: string | null;
  doctor_id?: number | null;
  doctor_name?: string | null;
  queue_number?: number | null;
  appointment_type?: string;
  notes?: string | null;
  cancellation_reason?: string | null;
  is_walk_in?: boolean;
  estimated_wait_minutes?: number | null;
  checked_in_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  appointment_created_by?: string | null;
  appointment_approved_by?: string | null;
  appointment_cancelled_by?: string | null;
  appointment_rescheduled_by?: string | null;
}

/** Live API returns appointment with queue info */
export interface LiveAppointmentItem {
  appointment: AppointmentRow;
  queue_position?: number;
  estimated_wait_minutes?: number;
}

/** Book appointment body */
export interface BookAppointmentBody {
  patient_id: number;
  clinic_id: number;
  department_id: number;
  doctor_id: number;
  appointment_type: string;
  appointment_date: string;
  scheduled_start_time: string;
  notes?: string | null;
  is_walk_in: boolean;
}

/** Update appointment body */
export interface UpdateAppointmentBody {
  patient_id: number;
  clinic_id: number;
  department_id: number;
  doctor_id: number;
  appointment_type: string;
  scheduled_start_time: string;
  notes?: string | null;
  is_walk_in: boolean;
}

/** Approve appointment body */
export interface ApproveAppointmentBody {
  appointment_date?: string;
  clinic_id: number;
  department_id: number;
  doctor_id: number;
  appointment_type: string;
  scheduled_start_time: string;
  notes?: string | null;
}

/** Reject appointment body */
export interface RejectAppointmentBody {
  cancellation_reason: string;
}

/** Reschedule appointment body */
export interface RescheduleAppointmentBody {
  appointment_date: string;
  scheduled_start_time: string;
  doctor_id?: number | null;
  clinic_id?: number | null;
  department_id?: number | null;
  notes?: string | null;
}

/** Follow-up appointment body */
export interface FollowUpAppointmentBody {
  appointment_date: string;
  scheduled_start_time: string;
  appointment_type: "FOLLOW_UP";
  notes?: string | null;
  doctor_id?: number | null;
}

/** Upcoming/History query params */
export interface AppointmentListParams {
  date_from?: string;
  date_to?: string;
  status?: string;
  clinic_id?: string | number;
  department_id?: string | number;
  doctor_id?: string | number;
  appointment_type?: string;
  patient_name?: string;
  page?: number;
  limit?: number;
}
