import bcryptjs from "bcryptjs";
import User, { Role } from "./user.model.js";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { userSearchableFields } from "./user.constant.js";

const createUser = async (payload) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const authProvider = {
    provider: "credentials",
    providerId: email,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getUsers = async (query) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");

  return {
    data: user,
  };
};

const getUser = async (id) => {
  const user = await User.findById(id).select("-password");

  return {
    data: user,
  };
};

const updateUser = async (userId, payload, decodedToken) => {
  if (
    decodedToken.role === Role.USER 
  ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.role) {
    if (
      decodedToken.role === Role.USER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }


  }

  if (
    payload.isActive ||
    payload.isDeleted ||
    payload.isVerified
  ) {
    if (
      decodedToken.role === Role.USER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(
    userId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return newUpdatedUser;
};


const deleteUser = async (userId, decodedToken) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    user.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const deletedUser = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );

  return deletedUser;
};



export const userServices = {
  createUser,
  getUsers,
  getMe,
  getUser,
  updateUser,
  deleteUser,
};
