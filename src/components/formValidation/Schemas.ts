import {
  zod_dateMin,
  zod_email,
  zod_fullName,
  zod_phoneNumber,
  zod_quantity,
  zod_singleSelectDropdown,
  zod_password,
  zod_username,
} from "@/utility/validator";
import z from "zod";

export const productQuantitySchema = z.object({
  branchId: zod_singleSelectDropdown(),
  quantity: zod_quantity(),
  batchNumber: z.any().optional(),
  expiryDate: zod_dateMin(),
});

export const removeProductQuantitySchema = z.object({
  branchId: zod_singleSelectDropdown(),
  quantity: zod_quantity(),
  batchNumber: z
    .string()
    .min(1, "Required")
    .max(10, "Batch number exceeds more than 10 letters"),
});

export const patientSchema = z.object({
  fullName: zod_fullName(),
  address: z
    .string()
    .min(1, "Required")
    .max(18, "Address exceeds more than 18 letters")
    .or(z.literal("")),
  phoneNumber: zod_phoneNumber(),
  email: zod_email().or(z.literal("")),
});

export const signupSchema = z.object({
  full_name: zod_fullName(),
  username: zod_username(),
  email: zod_email(),
  password: zod_password(),
  phone: zod_phoneNumber(),
  gender: z.enum(["M", "F"], {
    required_error: "Gender is required.",
    invalid_type_error: "Gender must be either M or F.",
  }),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: "Invalid date format.",
    })
    .transform((val) => {
      // Ensure YYYY-MM-DD format
      return new Date(val).toISOString().split("T")[0];
    }),
  age: z.number().nullable().optional(),
});

/** Patient profile update: at least one of date_of_birth or age is required. */
const optionalDob = z
  .string()
  .optional()
  .nullable()
  .transform((val) => (val && val.trim() !== "" ? val : undefined))
  .refine(
    (val) => {
      if (val == null || val === "") return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format." }
  );

const optionalAge = z
  .union([
    z.number().min(1, "Age must be at least 1.").max(150, "Age must be at most 150."),
    z.string().transform((s) => (s === "" ? undefined : Number(s))),
  ])
  .optional()
  .nullable()
  .refine(
    (v) =>
      v === undefined ||
      (typeof v === "number" && !isNaN(v) && v >= 1 && v <= 150),
    { message: "Age must be between 1 and 150." }
  );

export const patientProfileUpdateSchema = z
  .object({
    full_name: zod_fullName(),
    email: zod_email(),
    username: zod_username(),
    phone: z.union([zod_phoneNumber(), z.literal("")]),
    gender: z.enum(["M", "F"], { required_error: "Gender is required." }).nullable(),
    date_of_birth: optionalDob,
    age: optionalAge,
    address: z.string().max(200, "Address is too long.").optional().nullable(),
    blood_group: z
      .enum(["Ap", "An", "Bp", "Bn", "Op", "On", "ABp", "ABn"])
      .optional()
      .nullable(),
    emergency_contact_name: z.string().max(100).optional().nullable(),
    emergency_contact_phone: z
      .string()
      .refine((v) => !v || v === "" || /^9\d{9}$/.test(v), {
        message: "Must be a valid 10-digit Nepalese number when provided.",
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      const hasDob =
        data.date_of_birth != null && String(data.date_of_birth).trim() !== "";
      const numAge = data.age;
      const hasAge =
        numAge != null &&
        numAge !== "" &&
        !isNaN(Number(numAge)) &&
        Number(numAge) >= 1 &&
        Number(numAge) <= 150;
      return hasDob || hasAge;
    },
    {
      message: "Provide either Date of Birth or Age.",
      path: ["date_of_birth"],
    }
  );

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required."),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "New password must contain at least one letter and one number."),
    confirm_password: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New password and confirm password do not match.",
    path: ["confirm_password"],
  });

/** Staff / Superadmin profile update (users table fields) */
export const staffProfileUpdateSchema = z.object({
  full_name: zod_fullName(),
  email: zod_email(),
  username: zod_username(),
  phone: z.union([zod_phoneNumber(), z.literal("")]),
  gender: z.enum(["M", "F"]).nullable().optional(),
});

const addPatientDobAgeRefine = (
  data: { dob?: string | null; age?: unknown },
) => {
  const hasDob = data.dob != null && String(data.dob).trim() !== "";
  const numAge = data.age;
  const hasAge =
    numAge != null &&
    numAge !== "" &&
    !isNaN(Number(numAge)) &&
    Number(numAge) >= 1 &&
    Number(numAge) <= 150;
  return hasDob || hasAge;
};

const addPatientObjectSchema = z.object({
  full_name: zod_fullName(),
  username: zod_username(),
  email: zod_email(),
  password: zod_password(),
  phone: zod_phoneNumber(),
  gender: z.enum(["M", "F"], { required_error: "Gender is required." }),
  dob: optionalDob,
  age: optionalAge,
  address: z.string().max(200).optional().nullable(),
  blood_group: z
    .enum(["Ap", "An", "Bp", "Bn", "Op", "On", "ABp", "ABn"])
    .optional()
    .nullable(),
  emergency_contact_name: z.string().max(100).optional().nullable(),
  emergency_contact_phone: z
    .string()
    .refine((v) => !v || v === "" || /^9\d{9}$/.test(v), {
      message: "Must be a valid 10-digit Nepalese number when provided.",
    })
    .optional()
    .nullable(),
});

/** Add patient (admin): at least one of dob or age required */
export const addPatientSchema = addPatientObjectSchema.refine(
  addPatientDobAgeRefine,
  {
    message: "Provide either Date of Birth or Age.",
    path: ["dob"],
  },
);

/** Edit patient: same as add but no password */
export const editPatientSchema = addPatientObjectSchema
  .omit({ password: true })
  .refine(addPatientDobAgeRefine, {
    message: "Provide either Date of Birth or Age.",
    path: ["dob"],
  });
