import { Router } from "express";
import userRouter from "../modules/user/user.router.js";
import { AuthRoutes } from "../modules/auth/auth.routes.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;