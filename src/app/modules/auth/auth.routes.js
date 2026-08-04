import { Router } from "express";
import { authController } from "./auth.controller.js";
import passport from "passport";
import { envVars } from "../../config/env.js";
import { Role } from "../user/user.model.js";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token",authController.getNewAccessToken);

router.post("/logout", authController.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authController.changePassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  authController.setPassword
);
// router.post(
//   "/forget-password",

//   authController.forgetPassword
// );
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);

router.get(
  "/google",
  async (req, res, next) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect,
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issue with your account. Please contact with our support team!`,
  }),
  authController.googleCallbackController
);

export const AuthRoutes = router;
