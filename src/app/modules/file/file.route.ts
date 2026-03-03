import { Router } from "express";
import { FileController } from "./file.controller";
import auth from "../../middlewares/auth";
import { Role } from "src/generated/enums";

const router = Router();

// Upload file
router.post("/", auth(Role.USER), FileController.createFile);

// Get files
router.get("/", auth(Role.USER), FileController.getFiles);

// Rename file
router.patch("/:id", auth(Role.USER), FileController.updateFile);

// Delete file
router.delete("/:id", auth(Role.USER), FileController.deleteFile);

export const FileRoutes = router;
