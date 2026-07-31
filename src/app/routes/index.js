import { Router } from "express";
import userRouter from "../modules/user/user.router.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;