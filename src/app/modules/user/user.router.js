import { Router } from "express";
import { userController } from "./user.controller.js";
import { Role } from "./user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

import {
 
  updateUserValidation,
} from "./user.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const userRouter = Router();

userRouter.post("/create", userController.createUser);
// userRouter.get("/all-users", userController.getUsers);
userRouter.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getUsers,
);
userRouter.get("/me", checkAuth(...Object.values(Role)), userController.getMe);
userRouter.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getUser,
);
userRouter.patch(
  "/:id",
  validateRequest(updateUserValidation),
  checkAuth(...Object.values(Role)),
  userController.updateUser,
);
userRouter.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.deleteUser,
);



export default userRouter;
