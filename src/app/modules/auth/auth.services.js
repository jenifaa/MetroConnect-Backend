import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import User from "../user/user.model.js";

const credentialsLogin = async (payload) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password,
    isUserExist.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect password");
  }



  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    user: rest,
  };
};

export const AuthServices = {
  credentialsLogin,
};
