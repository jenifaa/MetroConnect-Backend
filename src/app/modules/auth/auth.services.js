import bcryptjs from "bcryptjs";
import StatusCodes from "http-status-codes";
import User from "../user/user.model.js";
import { createUserToken } from "../../utils/userTokens.js";

const credentialsLogin = async (payload) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email does not Exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password,
    isUserExist.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect password");
  }

  const userTokens = createUserToken(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

export const AuthServices = {
  credentialsLogin,
};
