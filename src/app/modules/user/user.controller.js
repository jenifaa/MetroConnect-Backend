import { sendResponse } from "../../utils/sendResponse.js";
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
  const result = await userServices.getUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
};

const getMe = async (req, res) => {
  try {
    const user = await userServices.getMe(req.user.userId);

    res.json(user);
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
    const user = await userServices.updateUser(
      req.params.id,
      req.body,
      req.user
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userServices.deleteUser(
      req.params.id,
      req.user
    );

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
  getMe,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
