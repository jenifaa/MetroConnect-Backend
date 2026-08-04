import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import Notification from "./notification.model.js";

const createNotification = async (payload) => {
  return Notification.create(payload);
};

const createBulkNotifications = async (notifications) => {
  if (!notifications.length) return [];
  return Notification.insertMany(notifications);
};

const getMyNotifications = async (userId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { receiver: userId };

  const [data, total] = await Promise.all([
    Notification.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("sender", "name email picture"),
    Notification.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const markAsRead = async (userId, payload) => {
  const { notificationIds, markAll } = payload;

  if (markAll) {
    await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true },
    );
    return { updated: "all" };
  }

  if (!notificationIds?.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Provide notificationIds or markAll",
    );
  }

  await Notification.updateMany(
    {
      _id: { $in: notificationIds },
      receiver: userId,
    },
    { isRead: true },
  );

  return { updated: notificationIds.length };
};

export const notificationServices = {
  createNotification,
  createBulkNotifications,
  getMyNotifications,
  markAsRead,
};
