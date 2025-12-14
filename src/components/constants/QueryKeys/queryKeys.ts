import { API_ENDPOINTS } from "../ApiEndpoints/apiEndpoints";

export const QUERY_KEYS = {
  GET_ALL_BRANCH: [API_ENDPOINTS.BRANCH.GET_ALL_BRANCH],
  GET_BRANCH_DROPDOWN: [API_ENDPOINTS.BRANCH.GET_BRANCH_DROPDOWN],
  GET_REPORTS_HEADER_DATA: (
    timeframe: string | undefined,
    branchId: number | null
  ) => [API_ENDPOINTS.REPORTS.GET_HEADER_DATA(timeframe, branchId)],
  GET_REPORTS_TOP_SELLING_PRODUCTS: (
    timeframe: string | undefined,
    branchId: number | null
  ) => [API_ENDPOINTS.REPORTS.GET_TOP_SELLING_PRODUCTS(timeframe, branchId)],
  GET_REPORTS_TOP_CUSTOMERS: (
    timeframe: string | undefined,
    branchId: number | null
  ) => [API_ENDPOINTS.REPORTS.GET_TOP_CUSTOMERS(timeframe, branchId)],
  GET_REPORTS_RECENT_TRANSACTIONS: (
    // timeframe: string | undefined,
    branchId: number | null
  ) => [API_ENDPOINTS.REPORTS.GET_RECENT_TRANSACTIONS(branchId)],
  GET_DASHBOARD_HEADER_DATA: (branchId: number | null) => [
    API_ENDPOINTS.DASHBOARD.GET_HEADER(branchId),
  ],
  GET_CONFIGURATION_DISCOUNT: [API_ENDPOINTS.DISCOUNT.GET_ALL_DISCOUNT],
};
