import passport from "passport";
import { catchAsync } from "../../utils/catchAsync.js";
import AppError from "../../errorHelpers/AppError.js";
import { createUserToken } from "../../utils/userTokens.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.services.js";
import { envVars } from "../../config/env.js";
import User, { IsActive } from "../user/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

const credentialsLogin = catchAsync(async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err.message);
    }

    if (!user) {
      return next(new AppError(401, info.message));
    }

    const userTokens = await createUserToken(user);

    const { password: pass, ...rest } = user.toObject();

    setAuthCookie(res, userTokens);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login Successfully",
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
      },
    });
  })(req, res, next);
});


const getNewAccessToken = catchAsync(
  async (req, res, next) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken 
    );


    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access token retrieved Successfully",
      data: tokenInfo,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req, res, next) => {
    let redirectTo = req.query.state ? (req.query.state) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);


const logout = catchAsync(
  async (req, res, next) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logout Successfully",
      data: null,
    });
  }
);


const changePassword = catchAsync(
  async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await AuthServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken 
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);
const setPassword = catchAsync(
  async (req, res, next) => {
    const decodedToken = req.user;
    const { password } = req.body || {};
    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Set Successfully",
      data: null,
    });
  }
);
// const forgetPassword = catchAsync(
//   async (req, res, next) => {
//     const { email } = req.body || {};
//     await AuthServices.forgetPassword(email);

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Email Sent Successfully",
//       data: null,
//     });
//   }
// );
const resetPassword = catchAsync(
  async (req, res, next) => {
 
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Reset Successfully",
      data: null,
    });
  }
);









export const authController = {
  credentialsLogin,
  getNewAccessToken,
  googleCallbackController,
  logout,
  changePassword,
  setPassword,
  resetPassword,
  
};
