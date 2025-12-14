import { User } from "@/core/private/UserManagement/StaffManagement/staffTypes";
import { API_ENDPOINTS } from "../constants/ApiEndpoints/apiEndpoints";
import { UserData } from "../ContextApi/AuthContext";
import { useApiGet } from "./ApiGet";
import { useApiMutation } from "./ApiMutation";

export type ApiListResponse<T> = {
  statusCode: number;
  message: string;
  data: T | T[];
};

export const useGetInit = () => {
  return useApiGet<ApiListResponse<UserData>>("/api/init", {
    retry: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
export const useGetStaffByType = (type: string | undefined) =>
  useApiGet<ApiListResponse<User>>(API_ENDPOINTS.STAFF.GET_STAFF_BY_TYPE, {
    queryParams: { type: type },
  });

export const useCreateUser = () =>
  useApiMutation("post", API_ENDPOINTS.STAFF.ADD_STAFF);
export const useUpdateUser = (id:string|number|undefined) =>
  useApiMutation("put", API_ENDPOINTS.STAFF.UPDATE_STAFF(id));
