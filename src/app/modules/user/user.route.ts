import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "src/app/middlewares/auth";
import { Role } from "src/generated/enums";
import { UserValidation } from "./user.validation";
import validateRequest from "src/app/middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(UserValidation.createUserSchema),
  UserController.createUser,
);
router.get("/", auth(Role.ADMIN), UserController.getUsers);

router.get("/me", auth(Role.USER), UserController.getSingleUser);

router.get("/:id", auth(Role.ADMIN), UserController.getSingleUser);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUser,
);

router.delete("/:id", auth(Role.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
