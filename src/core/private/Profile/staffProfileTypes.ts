/** Response from GET /api/profile (Staff / Superadmin – users table). Prefer snake_case; frontend accepts camelCase too. */
export interface StaffProfileResponse {
  full_name?: string;
  fullName?: string;
  email: string;
  username: string;
  phone?: string | null;
  gender?: string | null;
}

/** Payload for PUT /api/profile */
export interface UpdateStaffProfilePayload {
  full_name: string;
  email: string;
  username: string;
  phone?: string | null;
  gender?: string | null;
}

/** Payload for POST /api/profile/change-password */
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
