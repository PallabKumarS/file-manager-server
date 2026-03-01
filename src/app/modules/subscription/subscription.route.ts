import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import validateRequest from "src/app/middlewares/validateRequest";
import { SubscriptionValidation } from "./subscription.validation";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(SubscriptionValidation.createSubscriptionSchema),
  SubscriptionController.createSubscription,
);

router.get("/", auth(Role.ADMIN), SubscriptionController.getAllSubscriptions);

router.get(
  "/:id",
  auth(Role.ADMIN),
  SubscriptionController.getSingleSubscription,
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  SubscriptionController.updateSubscription,
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  SubscriptionController.deleteSubscription,
);

export const SubscriptionRoutes = router;
