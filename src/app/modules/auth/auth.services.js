import bcryptjs from "bcryptjs";
import StatusCodes from "http-status-codes";
import User from "../user/user.model.js";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens.js";

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



const getNewAccessToken = async (refreshToken) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};


const changePassword = async (
  oldPassword,
  newPassword,
  decodedToken
) => {
  const user = await User.findById(decodedToken.userId);


  
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password 
  );

  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old pass Does Not Match");
  }

  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user.save();
  return true;
};


const setPassword = async (userId, plainPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User Not found");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You have already set your password.Now you can change the password from your profile"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths = [...user.auths, credentialProvider];
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();

  
};


// const forgetPassword = async (email) => {
//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist");
//   }
//   if (!isUserExist.isVerified) {
//     throw new AppError(httpStatus.BAD_GATEWAY, "User is not verified");
//   }
//   if (
//     isUserExist.isActive === IsActive.BLOCKED ||
//     isUserExist.isActive === IsActive.INACTIVE
//   ) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `User is ${isUserExist.isActive}`
//     );
//   }
//   if (isUserExist.isDeleted) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
//   }

//   const jwtPayload = {
//     userId: isUserExist._id,
//     email: isUserExist.email,
//     role: isUserExist.role,
//   };
//   const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
//     expiresIn: "10m",
//   });

//   const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

//   sendEmail({
//     to: isUserExist.email,
//     subject: " Password Reset",
//     templateName: "forgetPassword",
//     templateData: {
//       name: isUserExist.name,
//       resetUILink,
//     },
//   });
// };



const resetPassword = async (
  payload,
  decodedToken
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You can not reset your password"
    );
  }

  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(401, "User does not exist");
  }
  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  isUserExist.password = hashedPassword;
  await isUserExist.save();

};




export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  resetPassword,
};
