import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { announcementServices } from "./announcement.service.js";

const createAnnouncement = catchAsync(async (req, res) => {
  const announcement = await announcementServices.createAnnouncement(
    req.body,
    req.user.userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Announcement created successfully",
    data: announcement,
  });
});

const getAnnouncements = catchAsync(async (req, res) => {
  const result = await announcementServices.getAnnouncements(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Announcements retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAnnouncementById = catchAsync(async (req, res) => {
  const announcement = await announcementServices.getAnnouncementById(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Announcement retrieved successfully",
    data: announcement,
  });
});

const updateAnnouncement = catchAsync(async (req, res) => {
  const announcement = await announcementServices.updateAnnouncement(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Announcement updated successfully",
    data: announcement,
  });
});

const deleteAnnouncement = catchAsync(async (req, res) => {
  await announcementServices.deleteAnnouncement(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Announcement deleted successfully",
    data: null,
  });
});

export const announcementController = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
