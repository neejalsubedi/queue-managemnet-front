export const API_ENDPOINTS = {
  // INIT: 'api/auth/init',
  AUTH: {
    LOGIN: "api/auth/login",
    REFRESH: "api/auth/refresh",
    // SIGNUP: "api/auth/signup",
    // FORGOT_PASSWORD: "api/auth/forgot-password",
    // POST_OTP: "api/auth/verify-otp-forget-password",
    // RESEND_OTP: "api/auth/resend-otp",
    // RESET_PASSWORD: "api/auth/reset-password",
    LOGOUT: "api/auth/logout",
  },
  DASHBOARD: {
    GET_HEADER: (branchId: number | null) => `api/dashboard/header/${branchId}`,
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
  STAFF:{
    GET_STAFF:"/api/users/getStaff",
    ADD_STAFF:"/api/users",
    UPDATE_STAFF:(id:string|number|undefined)=>`/api/users/${id}`
  },
    ROLE:{
        GET_Role:"/api/role/",
        ADD_ROLE:"/api/role/",
        UPDATE_ROLE:(id:string|number|undefined)=>`/api/role/${id}`,
        GET_PERMISSIONS:(id:string|number|undefined)=>`api/role/permissions/${id}`,
        UPDATE_PERMISSIONS:(id:string|number|undefined)=>`/api/permissions/${id}`,
    },
    CLINIC :{
      GET_CLINIC:"api/clinics/",
        ADD_CLINIC:"api/clinics/",
        DELETE_CLINIC:(id:string|number|undefined)=>`api/clinics/delete/${id}`,
        GET_CLINIC_BY_ID:(id:string|number|undefined)=>`api/clinics/${id}`,
        UPDATE_CLINIC:  (id:string|number|undefined)=>`api/clinics/${id}`,
    },
    DOCTOR :{
        GET_DOCTOR:"api/doctor/",
        ADD_DOCTOR:"api/doctor/",
        DELETE_DOCTOR:(id:string|number|undefined)=>`api/doctor/delete/${id}`,
        GET_DOCTOR_BY_ID:(id:string|number|undefined)=>`api/doctor/${id}`,
        UPDATE_DOCTOR:  (id:string|number|undefined,)=>`api/doctor/${id}`,
    },
    DEPARTMENT :{
        GET_DEPARTMENT:"api/departments/",
        ADD_DEPARTMENT:"api/departments/",
        DELETE_DEPARTMENT:(id:string|number|undefined)=>`api/departments/delete/${id}`,
        GET_DEPARTMENT_BY_ID:(id:string|number|undefined)=>`api/departments/${id}`,
        UPDATE_DEPARTMENT:  (departmentId:string|number|undefined)=>`api/departments/${departmentId}`,
    },
    PATIENT :{
        GET_PATIENT:"api/patient/",
        ADD_PATIENT:"api/patient/",
        DELETE_PATIENT:(id:string|number|undefined)=>`api/patient/${id}`,
        GET_PATIENT_BY_ID:(id:string|number|undefined)=>`api/patient/${id}`,
        UPDATE_PATIENT:  (id:string|number|undefined)=>`api/patient/${id}`,
    },
    DOCTOR_SHIFT :{
        GET_DOCTOR_SHIFT:(doctorId:string|number|undefined,departmentId:string|number|undefined)=>`/api/doctor-shifts/${doctorId}/${departmentId}`,
        ADD_DOCTOR_SHIFT:(doctorId:string|number|undefined,departmentId:string|number|undefined)=>`/api/doctor-shifts/${doctorId}/${departmentId}`,

    },
APPOINTMENT:{
        GET_LIVE_APPOINTMENT:`/api/appointments/live`,
        ADD_APPOINTMENT:`/api/appointments/book`,
    CHECK_IN:(id:number|undefined|string)=>`/api/appointments/check-in/${id}`,
    START:(id:number|undefined|string)=>`/api/appointments/start/${id}`,
    COMPLETE:(id:number|undefined|string)=>`/api/appointments/complete/${id}`,
    CANCEL:(id:number|undefined|string)=>`/api/appointments/cancel/${id}`,
    NO_SHOWN:(id:number|undefined|string)=>`/api/appointments/no-show/${id}`,
    UPDATE:(id:number|undefined|string)=>`/api/appointments/update/${id}`,
    GET_HISTORY:`api/appointments/history`,
    FOLLOW_UP:(id:number|undefined|string)=>`/api/appointments/follow-up/${id}`,
    RESCHEDULE:(id:number|undefined|string)=>`/api/appointments/reschedule/${id}`,


    }
};
