import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    subscriptionId: z.string().uuid().optional(),
  }),
});

export const UserValidation = { createUserSchema, updateUserSchema };
