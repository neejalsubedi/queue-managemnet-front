import z from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const zod_singleSelectDropdown = () => {
  return z.number().int().positive().min(1);
};

export const zod_quantity = () => {
  return z
    .string({ invalid_type_error: "enter valid quantity" })
    .regex(/^\d+$/, "Only whole numbers are allowed")
    .refine((value) => Number(value) > 0, {
      message: "Must be greater or equal to 0.",
    });
};

export const zod_dateMin = () => {
  return z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return date >= new Date(new Date().toDateString()); // ignore time portion
      },
      {
        message: "Date cannot be in the past.",
      }
    )
    .transform((val) => {
      // Always return just YYYY-MM-DD
      return new Date(val).toISOString().split("T")[0];
    });
};

export const zod_amount = () => {
  return z
    .string({ invalid_type_error: "Enter valid amount" })
    .regex(/^\d+$/, "Only whole numbers are allowed")
    .refine((value) => Number(value) > -1, {
      message: "Must be greater or equal to 0.",
    })
    .transform((val) => Number(val));
};

export const zod_email = () => {
  return z
    .string()
    .min(1, { message: "Required." })
    .regex(emailRegex, { message: "Invalid email format." });
};

export const zod_phoneNumber = () => {
  return z
    .string()
    .min(1, "Required.")
    .refine((phone) => /^9\d{9}$/.test(phone), {
      message: "Must be a valid 10-digit Nepalese number.",
    });
};

export const zod_fullName = () => {
  return z
    .string()
    .min(1, "Required.")
    .max(18, "Full name cannot exceed 18 characters.")
    .refine((value) => /^[A-Za-z\s]+$/.test(value), {
      message: "Full name can only contain letters and spaces.",
    });
};

export const zod_password = () => {
  return z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");
};

export const zod_username = () => {
  return z
    .string()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.");
};