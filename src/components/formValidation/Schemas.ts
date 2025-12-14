import {
  zod_dateMin,
  zod_email,
  zod_fullName,
  zod_phoneNumber,
  zod_quantity,
  zod_singleSelectDropdown,
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
