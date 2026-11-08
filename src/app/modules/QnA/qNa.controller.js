import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { qnaServices } from "./qNa.service.js";
 
const createQuestion = catchAsync(async (req, res) => {
  const result = await qnaServices.createQuestion(req.body, req.user.userId);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Question posted successfully",
    data: result,
  });
});
 
const getAllQuestions = catchAsync(async (req, res) => {
  const result = await qnaServices.getAllQuestions(req.query);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Questions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
 
const getMyQuestions = catchAsync(async (req, res) => {
  const result = await qnaServices.getMyQuestions(req.user.userId, req.query);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your questions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
 
const getQuestionById = catchAsync(async (req, res) => {
  const result = await qnaServices.getQuestionById(req.params.id);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question retrieved successfully",
    data: result,
  });
});
 
const updateQuestion = catchAsync(async (req, res) => {
  const result = await qnaServices.updateQuestion(
    req.params.id,
    req.body,
    req.user,
  );
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question updated successfully",
    data: result,
  });
});
 
const setSolvedStatus = catchAsync(async (req, res) => {
  const result = await qnaServices.setSolvedStatus(
    req.params.id,
    req.body.isSolved,
    req.user,
  );
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.isSolved
      ? "Question marked as solved"
      : "Question marked as unsolved",
    data: result,
  });
});
 
const deleteQuestion = catchAsync(async (req, res) => {
  await qnaServices.deleteQuestion(req.params.id, req.user);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question deleted successfully",
    data: null,
  });
});
 
const addComment = catchAsync(async (req, res) => {
  const result = await qnaServices.addComment(
    req.params.id,
    req.body.content,
    req.user.userId,
  );
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment added successfully",
    data: result,
  });
});
 
const deleteComment = catchAsync(async (req, res) => {
  await qnaServices.deleteComment(
    req.params.id,
    req.params.commentId,
    req.user,
  );
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: null,
  });
});
 
export const qnaController = {
  createQuestion,
  getAllQuestions,
  getMyQuestions,
  getQuestionById,
  updateQuestion,
  setSolvedStatus,
  deleteQuestion,
  addComment,
  deleteComment,
};