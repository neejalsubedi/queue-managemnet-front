export type Patient = {
  id?: number;
  full_name: string;
  username: string;
  email: string;
  password?: string;
  phone: string;
  gender: "M" | "F";
  /** Date of birth (YYYY-MM-DD). API uses date_of_birth; form uses dob. */
  dob?: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  address?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
};

/** API request body for add/update patient (uses date_of_birth) */
export type PatientCrudBody = Omit<Patient, "id" | "dob"> & {
  date_of_birth?: string | null;
};
