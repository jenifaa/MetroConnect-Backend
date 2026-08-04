import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { postServices } from "./post.service.js";

const createPost = catchAsync(async (req, res) => {
  const imageUrls = (req.files || []).map((file) => file.path);

  const post = await postServices.createPost(
    req.body,
    req.user.userId,
    imageUrls,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post created successfully",
    data: post,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const result = await postServices.getPosts(req.query, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postServices.getPostById(req.params.id, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postServices.updatePost(
    req.params.id,
    req.body,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: post,
  });
});

const deletePost = catchAsync(async (req, res) => {
  await postServices.deletePost(req.params.id, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null,
  });
});

const reactToPost = catchAsync(async (req, res) => {
  const post = await postServices.reactToPost(
    req.params.id,
    req.body.reactionType,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reaction updated successfully",
    data: post,
  });
});

const addComment = catchAsync(async (req, res) => {
  const post = await postServices.addComment(
    req.params.id,
    req.body.text,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment added successfully",
    data: post,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const post = await postServices.deleteComment(
    req.params.id,
    req.params.commentId,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: post,
  });
});

export const postController = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  reactToPost,
  addComment,
  deleteComment,
};
