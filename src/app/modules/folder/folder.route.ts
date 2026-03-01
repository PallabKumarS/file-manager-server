import { Router } from "express";
import { FolderController } from "./folder.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/", auth(Role.USER), FolderController.createFolder);
router.get("/", auth(Role.USER), FolderController.getFolders);
router.patch("/:id", auth(Role.USER), FolderController.updateFolder);
router.delete("/:id", auth(Role.USER), FolderController.deleteFolder);

export const FolderRoutes = router;
