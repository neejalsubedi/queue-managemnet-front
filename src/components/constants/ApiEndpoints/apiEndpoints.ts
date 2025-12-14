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
    GET_STAFF_BY_TYPE:"/api/users/staffByType",
    ADD_STAFF:"/api/users/addUsers",
    UPDATE_STAFF:(id:string|number|undefined)=>`/api/users/${id}`
  }
};
