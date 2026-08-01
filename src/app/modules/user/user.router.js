import { Router } from "express";
import { userController } from "./user.controller.js";

const userRouter = Router();

userRouter.post("/create", userController.createUser);
userRouter.get("/all", userController.getUsers);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
