export const API_ENDPOINTS = {
  // INIT: 'api/auth/init',
  AUTH: {
    LOGIN: "api/auth/login",
    REFRESH: "api/auth/refresh",
    SIGNUP: "api/auth/signup",
    LOGOUT: "api/auth/logout",
  },
  PROFILE: {
    GET: "api/profile",
    UPDATE: "api/profile",
    CHANGE_PASSWORD: "api/profile/change-password",
  },
  DASHBOARD: {
    GET_HEADER: (branchId: number | null) => `api/dashboard/header/${branchId}`,
    /** Summary stats (query: timeframe, clinicId) */
    GET_SUMMARY: "api/dashboard/summary",
    /** Appointments over time for bar chart (query: timeframe, clinicId) */
    GET_APPOINTMENTS_CHART: "api/dashboard/appointments-chart",
    /** Appointment types for donut (query: timeframe, clinicId) */
    GET_APPOINTMENT_TYPES: "api/dashboard/appointment-types",
    /** Pending approval requests (query: clinic_id optional) */
    GET_APPROVAL_REQUESTS: "api/dashboard/approval-requests",
    /** Doctors currently at work (query: clinic_id optional) */
    GET_DOCTORS_AT_WORK: "api/dashboard/doctors-at-work",
  },
  REPORTS: {
    GET_HEADER_DATA: (timeframe: string | undefined, branchId: number | null) =>
      `api/report/header/${timeframe}/${branchId}`,
    GET_TOP_SELLING_PRODUCTS: (
      timeframe: string | undefined,
      branchId: number | null
    ) => `api/report/top-selling-products/${timeframe}/${branchId}`,
    GET_TOP_CUSTOMERS: (
      timeframe: string | undefined,
      branchId: number | null
    ) => `api/report/top-customers/${timeframe}/${branchId}`,
    GET_RECENT_TRANSACTIONS: (
      // timeframe: string | undefined,
      branchId: number | null
    ) => `api/report/recent-transactions/${branchId}`,
    EXPORT_PDF_REPORT: (
      timeframe: string | undefined,
      branchId: number | null
    ) => `api/report/generate-pdf/${timeframe}/${branchId}`,
  },

  BRANCH: {
    ADD_BRANCH: "api/branch/save",
    GET_ALL_BRANCH: "api/branch/get-all",
    GET_BRANCH_DROPDOWN: "api/branch/get",
    UPDATE_BRANCH: (id: number | undefined) => `api/branch/update/${id}`,
    DELETE_BRANCH: "api/branch/delete",
  },
  DISCOUNT: {
    ADD_DISCOUNT: "api/discount/save",
    GET_ALL_DISCOUNT: "api/discount/get-all",
    DELETE_DISCOUNT: "api/discount/delete",
    UPDATE_DISCOUNT: (id: number | undefined) => `api/discount/update/${id}`,
  },
  STAFF: {
    GET_STAFF: "/api/users/getStaff",
    ADD_STAFF: "/api/users",
    UPDATE_STAFF: (id: string | number | undefined) => `/api/users/${id}`
  },
  ROLE: {
    GET_Role: "/api/role/",
    ADD_ROLE: "/api/role/",
    UPDATE_ROLE: (id: string | number | undefined) => `/api/role/${id}`,
    GET_PERMISSIONS: (id: string | number | undefined) => `api/role/permissions/${id}`,
    UPDATE_PERMISSIONS: (id: string | number | undefined) => `/api/role/permissions/${id}`,
  },
  CLINIC: {
    GET_CLINIC: "api/clinics/",
    GET_CLINICS_BY_STAFF: (staffId: string | number | undefined) => `api/clinics/${staffId}`,
    ADD_CLINIC: "api/clinics/",
    DELETE_CLINIC: (id: string | number | undefined) => `api/clinics/${id}`,
    GET_CLINIC_BY_ID: (id: string | number | undefined) => `api/clinics/${id}`,
    UPDATE_CLINIC: (id: string | number | undefined) => `api/clinics/${id}`,
  },
  DOCTOR: {
    GET_DOCTOR: "api/doctor/",
    ADD_DOCTOR: "api/doctor/",
    DELETE_DOCTOR: (doctorId: string | number | undefined, departmentId: string | number | undefined) => `api/doctor/${doctorId}/${departmentId}`,
    GET_DOCTOR_BY_ID: (id: string | number | undefined) => `api/doctor/${id}`,
    UPDATE_DOCTOR: (id: string | number | undefined,) => `api/doctor/${id}`,
  },
  DEPARTMENT: {
    GET_DEPARTMENT: "api/departments",
    ADD_DEPARTMENT: "api/departments",
    DELETE_DEPARTMENT: (id: string | number | undefined) => `api/departments/${id}`,
    GET_DEPARTMENT_BY_ID: (id: string | number | undefined) => `api/departments/${id}`,
    UPDATE_DEPARTMENT: (departmentId: string | number | undefined) => `api/departments/${departmentId}`,
  },
  PATIENT: {
    GET_PATIENT: "api/patient",
    ADD_PATIENT: "api/patient",
    DELETE_PATIENT: (id: string | number | undefined) => `api/patient/${id}`,
    DELETE_PATIENT_BASE: "api/patient",
    GET_PATIENT_BY_ID: (id: string | number | undefined) => `api/patient/${id}`,
    UPDATE_PATIENT: (id: string | number | undefined) => `api/patient/${id}`,
    // Patient Appointment Endpoints
    GET_CLINICS: "patient/clinics",
    GET_DOCTORS: (clinicId: number, date: string) => `patient/doctors?clinicId=${clinicId}&date=${date}`,
    BOOK_APPOINTMENT: "patient/appointment/book",
    GET_LIVE_APPOINTMENT: "patient/appointment/live",
    GET_UPCOMING_APPOINTMENTS: (status: "REQUESTED" | "BOOKED" | "REJECTED") => `patient/appointment/upcoming?status=${status}`,
    GET_APPOINTMENT_HISTORY: "patient/appointment/history",
    // Patient Profile
    GET_PROFILE: "patient/profile",
    UPDATE_PROFILE: "patient/profile",
    CHANGE_PASSWORD: "patient/profile/change-password",
  },
  DOCTOR_SHIFT: {
    GET_DOCTOR_SHIFT: (doctorId: string | number | undefined, departmentId: string | number | undefined) => `/api/doctor-shifts/${doctorId}/${departmentId}`,
    ADD_DOCTOR_SHIFT: (doctorId: string | number | undefined, departmentId: string | number | undefined) => `/api/doctor-shifts/${doctorId}/${departmentId}`,

  },
  APPOINTMENT: {
    /** GET doctor's appointments for a date at a clinic. Query: doctor_id, date, clinic_id */
    GET_DOCTOR_SCHEDULE: "api/appointments/doctor-schedule",
    BOOK: "api/appointments/book",
    UPDATE: (id: string | number | undefined) => `api/appointments/update/${id}`,
    APPROVE: (id: string | number | undefined) => `api/appointments/approve/${id}`,
    REJECT: (id: string | number | undefined) => `api/appointments/reject/${id}`,
    RESCHEDULE: (id: string | number | undefined) => `api/appointments/reschedule/${id}`,
    FOLLOW_UP: (id: string | number | undefined) => `api/appointments/follow-up/${id}`,
    CHECK_IN: (id: string | number | undefined) => `api/appointments/check-in/${id}`,
    START: (id: string | number | undefined) => `api/appointments/start/${id}`,
    COMPLETE: (id: string | number | undefined) => `api/appointments/complete/${id}`,
    CANCEL: (id: string | number | undefined) => `api/appointments/cancel/${id}`,
    NO_SHOW: (id: string | number | undefined) => `api/appointments/no-show/${id}`,
    LIVE: "api/appointments/live",
    UPCOMING: "api/appointments/upcoming",
    HISTORY: "api/appointments/history",
  },
};
