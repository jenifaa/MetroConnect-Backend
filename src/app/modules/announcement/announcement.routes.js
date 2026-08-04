import { Router } from "express";
import { Role } from "../user/user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { announcementController } from "./announcement.controller.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "./announcement.validation.js";

const announcementRouter = Router();

const allRoles = Object.values(Role);
const adminRoles = [Role.ADMIN, Role.SUPER_ADMIN];

announcementRouter.post(
  "/",
  checkAuth(...adminRoles),
  validateRequest(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

announcementRouter.get(
  "/",
  checkAuth(...allRoles),
  announcementController.getAnnouncements,
);

announcementRouter.get(
  "/:id",
  checkAuth(...allRoles),
  announcementController.getAnnouncementById,
);

announcementRouter.patch(
  "/:id",
  checkAuth(...adminRoles),
  validateRequest(updateAnnouncementSchema),
  announcementController.updateAnnouncement,
);

announcementRouter.delete(
  "/:id",
  checkAuth(...adminRoles),
  announcementController.deleteAnnouncement,
);

export default announcementRouter;
