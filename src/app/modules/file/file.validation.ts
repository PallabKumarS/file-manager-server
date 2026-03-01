import { z } from "zod";
import { FileType } from "@prisma/client";

const uploadFileSchema = z.object({
  name: z.string().min(1),
  folderId: z.string().uuid(),
  size: z.number(),
  type: z.nativeEnum(FileType),
  url: z.string(),
});

export const FileValidation = { uploadFileSchema };
