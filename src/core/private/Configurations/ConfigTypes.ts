export interface GetBranchDataResponse {
  statusCode: number;
  message: string;
  data: BranchListResponseData[];
}

export interface GetDiscountDataResponse {
  statusCode: number;
  message: string;
  data: DiscountListResponseData[];
}

export interface BranchListResponseData {
  id: number;
  name: string;
  address: string;
  phoneNumber: number;
  email: string;
}

export interface BranchData {
  id?: number;
  name: string;
  address: string;
  phoneNumber: number | null;
  email: string;
}

export interface DiscountListResponseData {
  id: number;
  name: string;
  percentage: number;
  description: string;
}

export interface DiscountFormData {
  name: string;
  percentage: number | null;
  description: string;
}
