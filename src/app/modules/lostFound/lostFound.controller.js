import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { lostFoundServices } from "./lostFound.service.js";

const createLostFound = catchAsync(async (req, res) => {
  const imageUrl = req.file?.path || "";

  const item = await lostFoundServices.createLostFound(
    req.body,
    req.user.userId,
    imageUrl,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Lost/Found report created successfully",
    data: item,
  });
});

const getLostFoundItems = catchAsync(async (req, res) => {
  const result = await lostFoundServices.getLostFoundItems(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Lost/Found items retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getLostFoundById = catchAsync(async (req, res) => {
  const item = await lostFoundServices.getLostFoundById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Lost/Found item retrieved successfully",
    data: item,
  });
});

const updateLostFound = catchAsync(async (req, res) => {
  const item = await lostFoundServices.updateLostFound(
    req.params.id,
    req.body,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Lost/Found item updated successfully",
    data: item,
  });
});

const deleteLostFound = catchAsync(async (req, res) => {
  await lostFoundServices.deleteLostFound(req.params.id, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Lost/Found item deleted successfully",
    data: null,
  });
});

export const lostFoundController = {
  createLostFound,
  getLostFoundItems,
  getLostFoundById,
  updateLostFound,
  deleteLostFound,
};
