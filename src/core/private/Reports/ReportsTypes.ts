export enum TimeIntervalType {
  Daily = "DAILY",
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
  Yearly = "YEARLY",
}

export interface HeaderListResponseData {
  todaySales: number;
  vatCollected: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface GetReportsHeaderDataResponse {
  statusCode: number;
  message: string;
  data: HeaderListResponseData;
}

export interface TopSellingProductList {
  name: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface GetTopSellingProductsResponse {
  statusCode: number;
  message: string;
  data: TopSellingProductList[];
}

export interface TopCustomersList {
  id?: number;
  fullName: string;
  totalVisit: number;
  totalAmount: number;
}

export interface GetTopCustomersResponse {
  statusCode: number;
  message: string;
  data: TopCustomersList[];
}

export interface RecentTransactionsList {
  transactionId: number;
  patientName: string;
  itemsCount: number;
  amount: number;
  vat: number;
  date: string;
  productNames: string;
}

// export interface RecentTransactionsData {
//   total: number;
//   pageNumber: number | null;
//   limit: number | null;
//   data: RecentTransactionsList[];
// }

export interface GetRecenetTransactionsResponse {
  statusCode: number;
  message: string;
  data: RecentTransactionsList[];
}
