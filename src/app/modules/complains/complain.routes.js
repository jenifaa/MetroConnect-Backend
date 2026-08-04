import { Router } from "express";
import { Role } from "../user/user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { complainController } from "./complain.controller.js";
import {
  submitComplainSchema,
  updateComplainAdminSchema,
} from "./complain.validation.js";

const complainRouter = Router();

const allRoles = Object.values(Role);
const adminRoles = [Role.ADMIN, Role.SUPER_ADMIN];

complainRouter.post(
  "/",
  checkAuth(...allRoles),
  validateRequest(submitComplainSchema),
  complainController.submitComplain,
);

complainRouter.get(
  "/me",
  checkAuth(...allRoles),
  complainController.getMyComplaints,
);

complainRouter.get(
  "/me/:id",
  checkAuth(...allRoles),
  complainController.getMyComplaintById,
);

complainRouter.get(
  "/",
  checkAuth(...adminRoles),
  complainController.getAllComplaintsAdmin,
);

complainRouter.patch(
  "/:id",
  checkAuth(...adminRoles),
  validateRequest(updateComplainAdminSchema),
  complainController.updateComplaintAdmin,
);

complainRouter.delete(
  "/:id",
  checkAuth(...adminRoles),
  complainController.deleteComplaintAdmin,
);

export default complainRouter;
