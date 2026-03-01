import { z } from "zod";

const createFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

export const FolderValidation = { createFolderSchema };
