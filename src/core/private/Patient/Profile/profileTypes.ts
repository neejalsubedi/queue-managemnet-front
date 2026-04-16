/** Nested profile data returned by GET /patient/profile */
export interface PatientProfileNested {
  date_of_birth?: string | null;
  age?: number | null;
  address?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
}

/** Full response from GET /patient/profile (user + profile) */
export interface PatientProfileResponse {
  full_name: string;
  email: string;
  username: string;
  phone: string;
  gender: string | null;
  profile: PatientProfileNested;
}

/** Payload for PUT /patient/profile */
export interface UpdatePatientProfilePayload {
  full_name: string;
  email: string;
  username: string;
  phone: string;
  gender: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  address?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
}

/** Payload for POST /patient/profile/change-password */
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
