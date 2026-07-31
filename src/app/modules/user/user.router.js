import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/register", userController.createUser);

router.get("/users", userController.getUsers);

router.get("/profile/:id", userController.getUser);

router.put("/update/:id", userController.updateUser);

router.delete("/delete/:id", userController.deleteUser);

export const userRouter = router;
