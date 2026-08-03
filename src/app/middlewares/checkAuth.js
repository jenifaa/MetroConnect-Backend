import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import User, { IsActive } from "../modules/user/user.model.js";
import { envVars } from "../config/env.js";



export const checkAuth =
  (...authRoles) =>
  async (req, res, next) => {
    try {
      let accessToken =
        req.headers.authorization || req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No token received");
      }

     
      if (
        typeof accessToken === "string" &&
        accessToken.startsWith("Bearer ")
      ) {
        accessToken = accessToken.slice(7);
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      );

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User does not exist"
        );
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User is deleted"
        );
      }

      if (!isUserExist.isVerified) {
        throw new AppError(
          httpStatus.BAD_GATEWAY,
          "User is not verified"
        );
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to view this resource"
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };