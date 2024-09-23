import { z } from "zod";

export const usernameValidation = z
  .string({
    required_error: "Username is required",
  })
  .min(4, { message: "Username must be atleast 4 characters" })
  .max(20, { message: "Username must be 20 characters or less" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only contain letters and numbers",
  });

export const identifierValidation = z
  .string({
    required_error: "Username/Email is required",
  })
  .min(4, { message: "Username/Email must be atleast 4 characters" })
  .regex(/^(?![0-9])[\w.-]+(?:@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})?$/, {
    message: "Username/Email is not valid",
  });

export const passwordValidation = z
  .string({
    required_error: "Password is required",
  })
  .min(8, { message: "Password must be atleast 8 characters" })
  .max(20, { message: "Password must be 20 characters or less" });

export const signUpSchema = z
  .object({
    username: usernameValidation,
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address")
      .max(300, {
        message: "Email can't be longer than 300 characters.",
      }),
    password: passwordValidation,
    confirmPassword: z
      .string({
        required_error: "Confirm Password is required",
      })
      .min(8, { message: "Confirm Password must be atleast 8 characters" })
      .max(20, { message: "Confirm Password must be 20 characters or less" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const verifySchema = z.object({
  otp: z.string().length(6, "Otp must be 6 characters"),
});

export const signInSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});

export const forgotPasswordSchema = z.object({
  identifier: identifierValidation,
});

export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z
      .string({
        required_error: "Confirm Password is required",
      })
      .min(8, { message: "Confirm Password must be atleast 8 characters" })
      .max(20, { message: "Confirm Password must be 20 characters or less" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
