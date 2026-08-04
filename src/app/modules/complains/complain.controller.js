import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { complainServices } from "./complain.service.js";

const submitComplain = catchAsync(async (req, res) => {
  const complaint = await complainServices.submitComplain(
    req.body,
    req.user.userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Complaint submitted successfully",
    data: complaint,
  });
});

const getMyComplaints = catchAsync(async (req, res) => {
  const result = await complainServices.getMyComplaints(
    req.user.userId,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your complaints retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyComplaintById = catchAsync(async (req, res) => {
  const complaint = await complainServices.getComplaintByIdForStudent(
    req.params.id,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Complaint retrieved successfully",
    data: complaint,
  });
});

const getAllComplaintsAdmin = catchAsync(async (req, res) => {
  const result = await complainServices.getAllComplaintsAdmin(
    req.query,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Complaints retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateComplaintAdmin = catchAsync(async (req, res) => {
  const complaint = await complainServices.updateComplaintAdmin(
    req.params.id,
    req.body,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Complaint updated successfully",
    data: complaint,
  });
});

const deleteComplaintAdmin = catchAsync(async (req, res) => {
  await complainServices.deleteComplaintAdmin(req.params.id, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Complaint deleted successfully",
    data: null,
  });
});

export const complainController = {
  submitComplain,
  getMyComplaints,
  getMyComplaintById,
  getAllComplaintsAdmin,
  updateComplaintAdmin,
  deleteComplaintAdmin,
};
