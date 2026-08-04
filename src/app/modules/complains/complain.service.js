import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Role } from "../user/user.model.js";
import Complain from "./complain.model.js";
import {
  formatComplainForViewer,
  formatComplaintsForViewer,
} from "./complain.helpers.js";

const isComplaintManager = (role) =>
  role === Role.ADMIN || role === Role.SUPER_ADMIN;

const complainPopulate = {
  path: "submittedBy",
  select: "name email picture",
};

const submitComplain = async (payload, userId) => {
  const complaint = await Complain.create({
    ...payload,
    submittedBy: userId,
  });

  const populated = await Complain.findById(complaint._id).populate(
    complainPopulate,
  );

  return formatComplainForViewer(populated, {
    userId,
    role: Role.USER,
  });
};

const getMyComplaints = async (userId, query) => {
  const baseQuery = Complain.find({
    submittedBy: userId,
    isDeleted: false,
  });

  const queryBuilder = new QueryBuilder(baseQuery, query);
  const complaintsQuery = queryBuilder.sort().paginate().build().populate(
    complainPopulate,
  );

  const [complaints, meta] = await Promise.all([
    complaintsQuery,
    queryBuilder.getMeta(),
  ]);

  return {
    data: formatComplaintsForViewer(complaints, {
      userId,
      role: Role.USER,
    }),
    meta,
  };
};

const getComplaintByIdForStudent = async (complaintId, viewer) => {
  const complaint = await Complain.findOne({
    _id: complaintId,
    isDeleted: false,
    submittedBy: viewer.userId,
  }).populate(complainPopulate);

  if (!complaint) {
    throw new AppError(httpStatus.NOT_FOUND, "Complaint not found");
  }

  return formatComplainForViewer(complaint, viewer);
};

const getAllComplaintsAdmin = async (query, viewer) => {
  if (!isComplaintManager(viewer.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const baseQuery = Complain.find({ isDeleted: false });
  const queryBuilder = new QueryBuilder(baseQuery, query);
  const complaintsQuery = queryBuilder
    .filter()
    .sort()
    .paginate()
    .build()
    .populate(complainPopulate);

  const [complaints, meta] = await Promise.all([
    complaintsQuery,
    queryBuilder.getMeta(),
  ]);

  return {
    data: formatComplaintsForViewer(complaints, viewer),
    meta,
  };
};

const updateComplaintAdmin = async (complaintId, payload, viewer) => {
  if (!isComplaintManager(viewer.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const complaint = await Complain.findOne({
    _id: complaintId,
    isDeleted: false,
  });

  if (!complaint) {
    throw new AppError(httpStatus.NOT_FOUND, "Complaint not found");
  }

  Object.assign(complaint, payload);
  await complaint.save();

  const populated = await Complain.findById(complaint._id).populate(
    complainPopulate,
  );

  return formatComplainForViewer(populated, viewer);
};

const deleteComplaintAdmin = async (complaintId, viewer) => {
  if (!isComplaintManager(viewer.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const complaint = await Complain.findOne({
    _id: complaintId,
    isDeleted: false,
  });

  if (!complaint) {
    throw new AppError(httpStatus.NOT_FOUND, "Complaint not found");
  }

  complaint.isDeleted = true;
  await complaint.save();

  return complaint;
};

export const complainServices = {
  submitComplain,
  getMyComplaints,
  getComplaintByIdForStudent,
  getAllComplaintsAdmin,
  updateComplaintAdmin,
  deleteComplaintAdmin,
};
