import { Router } from "express";
import { Role } from "../user/user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { notificationController } from "./notification.controller.js";
import { markNotificationsReadSchema } from "./notification.validation.js";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  checkAuth(...Object.values(Role)),
  notificationController.getMyNotifications,
);

notificationRouter.patch(
  "/read",
  checkAuth(...Object.values(Role)),
  validateRequest(markNotificationsReadSchema),
  notificationController.markAsRead,
);

export default notificationRouter;
