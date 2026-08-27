import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { postServices } from "./post.service.js";

const createPost = catchAsync(async (req, res) => {
  const imageUrl = req.file?.path 

  const post = await postServices.createPost(
    req.body,
    req.user.userId,
    imageUrl,
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

const getPostsByAuthorId = catchAsync(async (req, res) => {
  const { authorId } = req.params;

  const result = await postServices.getPostsByAuthorId(
    authorId,
    req.query,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Author posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyPosts = catchAsync(async (req, res) => {
  const result = await postServices.getPostsByAuthorId(
    req.user.userId,
    req.query,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your posts retrieved successfully",
    meta: result.meta,
    data: result.data,
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
  getPostsByAuthorId,
  getMyPosts,
};
