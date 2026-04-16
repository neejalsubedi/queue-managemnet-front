export interface RoleRequest {
  role_name: string;
  code: string;
  description: string;
}
export interface RoleResponse {
  id: number;
  role_name: string;
  code: string;
  description: string;
}
export interface PermissionApiItem {
    module_id: string;
    name: string;
    code: string;
    can_read: boolean;
    can_write: boolean;
    can_update: boolean;
    can_delete: boolean;
}



