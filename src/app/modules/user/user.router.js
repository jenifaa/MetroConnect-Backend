import { Router } from "express";
import { userController } from "./user.controller.js";
import { Role } from "./user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { updateUserValidation } from "./user.validation.js";

const userRouter = Router();

userRouter.post("/create", userController.createUser);
userRouter.get("/all-users", userController.getUsers);
userRouter.get("/me", checkAuth(...Object.values(Role)), userController.getMe);
userRouter.get("/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getUser);
userRouter.patch(
  "/:id",
  validateRequest(updateUserValidation),
  checkAuth(...Object.values(Role)),
  userController.updateUser,
)
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
