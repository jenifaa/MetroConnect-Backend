import { Router } from "express";
import { Role } from "../user/user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { multerUpload } from "../../config/multer.config.js";
import { lostFoundController } from "./lostFound.controller.js";
import {
  createLostFoundSchema,
  updateLostFoundSchema,
} from "./lostFound.validation.js";

const lostFoundRouter = Router();

const allRoles = Object.values(Role);

lostFoundRouter.post(
  "/",
  checkAuth(...allRoles),
  multerUpload.single("image"),
  validateRequest(createLostFoundSchema),
  lostFoundController.createLostFound,
);

lostFoundRouter.get(
  "/",
  checkAuth(...allRoles),
  lostFoundController.getLostFoundItems,
);

lostFoundRouter.get(
  "/:id",
  checkAuth(...allRoles),
  lostFoundController.getLostFoundById,
);

lostFoundRouter.patch(
  "/:id",
  checkAuth(...allRoles),
  validateRequest(updateLostFoundSchema),
  lostFoundController.updateLostFound,
);

lostFoundRouter.delete(
  "/:id",
  checkAuth(...allRoles),
  lostFoundController.deleteLostFound,
);

export default lostFoundRouter;
