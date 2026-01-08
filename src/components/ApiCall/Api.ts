import {User} from "@/core/private/UserManagement/StaffManagement/staffTypes";
import {API_ENDPOINTS} from "../constants/ApiEndpoints/apiEndpoints";
import {UserData} from "../ContextApi/AuthContext";
import {useApiGet} from "./ApiGet";
import {useApiMutation} from "./ApiMutation";
import {RoleResponse} from "@/core/private/UserManagement/RoleManagement/roleTypes.ts";
import {GetClinicResponse} from "@/core/private/UserManagement/ClinicMnagement/clinicType.ts";

export type ApiListResponse<T> = {
    statusCode: number;
    message: string;
    data: T[];
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
        queryParams: {type: type},
    });

export const useCreateUser = () =>
    useApiMutation("post", API_ENDPOINTS.STAFF.ADD_STAFF);
export const useUpdateUser = (id: string | number | undefined) =>
    useApiMutation("put", API_ENDPOINTS.STAFF.UPDATE_STAFF(id));
export const useGetRole = () =>
    useApiGet<ApiListResponse<RoleResponse>>(API_ENDPOINTS.ROLE.GET_Role)
export const useAddRole = () =>
    useApiMutation("post", API_ENDPOINTS.ROLE.ADD_ROLE);
export const useUpdateRole = (id: string | number | undefined) =>
    useApiMutation("put",API_ENDPOINTS.ROLE.UPDATE_ROLE(id));
export const useGetPermissions = (id: string | number | undefined) =>
    useApiGet(API_ENDPOINTS.ROLE.GET_PERMISSIONS(id));
export const useUpdatePermissions = (id: string | number | undefined) =>
    useApiMutation("put",API_ENDPOINTS.ROLE.UPDATE_ROLE(id));
export const useGetClinic = () =>
    useApiGet<ApiListResponse<GetClinicResponse>>(API_ENDPOINTS.CLINIC.GET_CLINIC);
export const useUpdateClinic = (id: string | number | undefined) =>
    useApiMutation("put", API_ENDPOINTS.CLINIC.UPDATE_CLINIC(id))
export const useDeleteClinic = (id: string | number | undefined) =>
    useApiMutation("delete", API_ENDPOINTS.CLINIC.DELETE_CLINIC(id))
export const useAddClinic = () =>
    useApiMutation("post", API_ENDPOINTS.CLINIC.ADD_CLINIC)
export const useGetDoctor = (id:string|number|undefined) =>
    useApiGet(API_ENDPOINTS.DOCTOR.GET_DOCTOR,{
        queryParams: {departmentId:id}
    });
export const useAddDoctor = () =>
    useApiMutation("post", API_ENDPOINTS.DOCTOR.ADD_DOCTOR);
export const useUpdateDoctor = (doctorId: string | number | undefined, departmentId: string | number | undefined) =>
    useApiMutation("put", API_ENDPOINTS.DOCTOR.UPDATE_DOCTOR(doctorId, departmentId))
export const useGetDoctorById = (id: string | number | undefined) =>
    useApiGet(API_ENDPOINTS.DOCTOR.GET_DOCTOR_BY_ID(id))
export const useDeleteDoctor = (id: string | number | undefined) =>
    useApiMutation("delete", API_ENDPOINTS.DOCTOR.DELETE_DOCTOR(id))

export const useAddDepartment = () =>
    useApiMutation("post", API_ENDPOINTS.DEPARTMENT.ADD_DEPARTMENT);

export const useGetDepartment = (id:string|number|undefined) =>
    useApiGet(API_ENDPOINTS.DEPARTMENT.GET_DEPARTMENT,{
        queryParams:{clinicId:id}
    });
export const useUpdateDepartment = ( departmentId: string | number | undefined) =>
    useApiMutation("put", API_ENDPOINTS.DEPARTMENT.UPDATE_DEPARTMENT( departmentId))
export const useGetDepartmentById = (id: string | number | undefined) =>
    useApiGet(API_ENDPOINTS.DEPARTMENT.GET_DEPARTMENT_BY_ID(id))
export const useDeleteDepartment = (id: string | number | undefined) =>
    useApiMutation("delete", API_ENDPOINTS.DEPARTMENT.DELETE_DEPARTMENT(id))

