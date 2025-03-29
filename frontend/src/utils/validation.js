import { z } from "zod";

// ✅ Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Signup Schema
export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  alternatePhone: z
    .string()
    .regex(/^[0-9]{10}$/, "Alternate phone number must be exactly 10 digits")
    .optional()
    .or(z.literal("")), // Optional field
});
