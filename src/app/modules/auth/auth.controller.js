import passport from "passport";
import { catchAsync } from "../../utils/catchAsync.js";
import AppError from "../../errorHelpers/AppError.js";
import { createUserToken } from "../../utils/userTokens.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";


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

export const authController = {
  credentialsLogin,
};
