import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "src/app/middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", auth(Role.ADMIN), UserController.getUsers);
router.get("/:id", auth(Role.ADMIN), UserController.getSingleUser);
router.patch("/:id", auth(Role.ADMIN), UserController.updateUser);
router.delete("/:id", auth(Role.ADMIN), UserController.deleteUser);

export const UserRoutes = router;