import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import User, { Role } from "../user/user.model.js";
import { notificationServices } from "../notification/notification.service.js";
import { NotificationType } from "../notification/notification.constant.js";
import Announcement from "./announcement.model.js";
import { announcementSearchableFields } from "./announcement.constant.js";

const announcementPopulate = {
  path: "createdBy",
  select: "name email picture role",
};

const createAnnouncement = async (payload, adminId) => {
  const announcement = await Announcement.create({
    ...payload,
    createdBy: adminId,
  });

  const students = await User.find({
    role: Role.USER,
    isDeleted: false,
    isVerified: true,
  }).select("_id");

  const notifications = students.map((student) => ({
    receiver: student._id,
    sender: adminId,
    type: NotificationType.ANNOUNCEMENT,
    message: `New announcement: ${announcement.title}`,
  }));

  await notificationServices.createBulkNotifications(notifications);

  return Announcement.findById(announcement._id).populate(announcementPopulate);
};

const getAnnouncements = async (query) => {
  const baseQuery = Announcement.find({ isDeleted: false });
  const queryBuilder = new QueryBuilder(baseQuery, query);

  const announcementsQuery = queryBuilder
    .search(announcementSearchableFields)
    .filter()
    .sort()
    .paginate()
    .build()
    .populate(announcementPopulate);

  const [data, meta] = await Promise.all([
    announcementsQuery,
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getAnnouncementById = async (id) => {
  const announcement = await Announcement.findOne({
    _id: id,
    isDeleted: false,
  }).populate(announcementPopulate);

  if (!announcement) {
    throw new AppError(httpStatus.NOT_FOUND, "Announcement not found");
  }

  return announcement;
};

const updateAnnouncement = async (id, payload) => {
  const announcement = await Announcement.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!announcement) {
    throw new AppError(httpStatus.NOT_FOUND, "Announcement not found");
  }

  Object.assign(announcement, payload);
  await announcement.save();

  return Announcement.findById(announcement._id).populate(announcementPopulate);
};

const deleteAnnouncement = async (id) => {
  const announcement = await Announcement.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!announcement) {
    throw new AppError(httpStatus.NOT_FOUND, "Announcement not found");
  }

  announcement.isDeleted = true;
  await announcement.save();

  return announcement;
};

export const announcementServices = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
