import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  subscriptionId: z.string().uuid(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  subscriptionId: z.string().uuid().optional(),
});

export const UserValidation = { createUserSchema, updateUserSchema };
