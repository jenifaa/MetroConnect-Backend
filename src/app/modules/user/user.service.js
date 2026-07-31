import User from "./user.model";


const createUser = async (data) => {
  return await User.create(data);
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
