import { FileType } from "src/generated/enums";
import { z } from "zod";

const uploadFileSchema = z.object({
  name: z.string().min(1),
  folderId: z.string().uuid(),
  size: z.number(),
  type: z.nativeEnum(FileType),
  url: z.string(),
});

export const FileValidation = { uploadFileSchema };
