import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { notificationServices } from "./notification.service.js";

const getMyNotifications = catchAsync(async (req, res) => {
  const result = await notificationServices.getMyNotifications(
    req.user.userId,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notifications retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const result = await notificationServices.markAsRead(
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notifications marked as read",
    data: result,
  });
});

export const notificationController = {
  getMyNotifications,
  markAsRead,
};
