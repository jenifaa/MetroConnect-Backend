import passport from "passport";
import { catchAsync } from "../../utils/catchAsync.js";
import AppError from "../../errorHelpers/AppError.js";
import { createUserToken } from "../../utils/userTokens.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.services.js";
import { envVars } from "../../config/env.js";


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

export const authController = {
  credentialsLogin,
  getNewAccessToken,
  googleCallbackController
};
