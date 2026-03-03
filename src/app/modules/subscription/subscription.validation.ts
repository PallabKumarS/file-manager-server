import { z } from "zod";
import { FileType, PackageType } from "src/generated/client";

const createSubscriptionSchema = z.object({
  type: z.nativeEnum(PackageType),
  maxFolder: z.number().min(1),
  nestFolder: z.number().min(1),
  fileSize: z.number().min(1),
  fileTotal: z.number().min(1),
  filePerFolder: z.number().min(1),
  allowedFileTypes: z.array(z.nativeEnum(FileType)),
});

export const SubscriptionValidation = { createSubscriptionSchema };
