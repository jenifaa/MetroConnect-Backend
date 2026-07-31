import bcryptjs from "bcryptjs";
import User from "./user.model.js";
import httpStatus from "http-status-codes";

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

const getUsers = async () => {
  return await User.find();
};

const getUser = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const userServices = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
