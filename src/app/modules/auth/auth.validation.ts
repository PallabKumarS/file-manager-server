import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ error: "Id is required." }),
    password: z.string({ error: "Password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      error: "Old password is required",
    }),
    newPassword: z.string({ error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
