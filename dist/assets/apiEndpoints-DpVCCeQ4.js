const T = {
  AUTH: {
    LOGIN: "api/auth/login",
    REFRESH: "api/auth/refresh",
    LOGOUT: "api/auth/logout",
  },
  DASHBOARD: { GET_HEADER: (a) => `api/dashboard/header/${a}` },
  REPORTS: {
    GET_HEADER_DATA: (a, e) => `api/report/header/${a}/${e}`,
    GET_TOP_SELLING_PRODUCTS: (a, e) =>
      `api/report/top-selling-products/${a}/${e}`,
    GET_TOP_CUSTOMERS: (a, e) => `api/report/top-customers/${a}/${e}`,
    GET_RECENT_TRANSACTIONS: (a) => `api/report/recent-transactions/${a}`,
    EXPORT_PDF_REPORT: (a, e) => `api/report/generate-pdf/${a}/${e}`,
  },
  BRANCH: {
    ADD_BRANCH: "api/branch/save",
    GET_ALL_BRANCH: "api/branch/get-all",
    GET_BRANCH_DROPDOWN: "api/branch/get",
    UPDATE_BRANCH: (a) => `api/branch/update/${a}`,
    DELETE_BRANCH: "api/branch/delete",
  },
  DISCOUNT: {
    ADD_DISCOUNT: "api/discount/save",
    GET_ALL_DISCOUNT: "api/discount/get-all",
    DELETE_DISCOUNT: "api/discount/delete",
    UPDATE_DISCOUNT: (a) => `api/discount/update/${a}`,
  },
};
export { T as A };
