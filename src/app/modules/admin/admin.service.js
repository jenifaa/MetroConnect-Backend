import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import User, { IsActive, Role } from "../user/user.model.js";
import Post from "../post/post.model.js";
import Complain from "../complains/complain.model.js";
import Announcement from "../announcement/announcement.model.js";
import { userServices } from "../user/user.service.js";
import { ComplaintStatus } from "../complains/complain.constant.js";

const mapUserStatus = (isActive) => {
  if (isActive === IsActive.BLOCKED) {
    return "suspended";
  }

  return "active";
};

const mapStatusToDb = (status) => {
  if (status === "suspended") {
    return IsActive.BLOCKED;
  }

  if (status === "active") {
    return IsActive.ACTIVE;
  }

  throw new AppError(httpStatus.BAD_REQUEST, "Invalid status value");
};

const formatAdminUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };

  delete userObject.password;

  return {
    ...userObject,
    status: mapUserStatus(userObject.isActive),
  };
};

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalPosts,
    totalComplaints,
    totalAnnouncements,
    pendingComplaints,
    resolvedComplaints,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Post.countDocuments({ isDeleted: false }),
    Complain.countDocuments({ isDeleted: false }),
    Announcement.countDocuments({ isDeleted: false }),
    Complain.countDocuments({
      isDeleted: false,
      status: ComplaintStatus.PENDING,
    }),
    Complain.countDocuments({
      isDeleted: false,
      status: ComplaintStatus.RESOLVED,
    }),
  ]);

  return {
    totalUsers,
    totalPosts,
    totalComplaints,
    totalAnnouncements,
    pendingComplaints,
    resolvedComplaints,
    totalQuestions: 0,
    reportedContentCount: 0,
  };
};

const getAdminUsers = async (query) => {
  const result = await userServices.getUsers(query);

  return {
    data: result.data.map(formatAdminUser),
    meta: result.meta,
  };
};

const updateUserStatus = async (userId, payload, decodedToken) => {
  const updatePayload = { ...payload };

  if (payload.status) {
    updatePayload.isActive = mapStatusToDb(payload.status);
    delete updatePayload.status;
  }

  const updatedUser = await userServices.updateUser(
    userId,
    updatePayload,
    decodedToken,
  );

  return formatAdminUser(updatedUser);
};

export const adminServices = {
  getDashboardStats,
  getAdminUsers,
  updateUserStatus,
};
