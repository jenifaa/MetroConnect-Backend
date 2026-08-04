import { Router } from "express";
import userRouter from "../modules/user/user.router.js";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import postRouter from "../modules/post/post.routes.js";
import complainRouter from "../modules/complains/complain.routes.js";
import announcementRouter from "../modules/announcement/announcement.routes.js";
import notificationRouter from "../modules/notification/notification.routes.js";
import lostFoundRouter from "../modules/lostFound/lostFound.routes.js";

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
  {
    path: "/posts",
    route: postRouter,
  },
  {
    path: "/complains",
    route: complainRouter,
  },
  {
    path: "/announcements",
    route: announcementRouter,
  },
  {
    path: "/notifications",
    route: notificationRouter,
  },
  {
    path: "/lost-found",
    route: lostFoundRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
