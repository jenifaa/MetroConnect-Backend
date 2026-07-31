import { userServices } from "./user.service.js";

const createUser = async (req, res) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userServices.getUsers();

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userServices.getUser(req.params.id);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userServices.updateUser(req.params.id, req.body);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userServices.deleteUser(req.params.id);

    res.json({
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const userController = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
