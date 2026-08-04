import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Role } from "../user/user.model.js";
import { notificationServices } from "../notification/notification.service.js";
import { NotificationType } from "../notification/notification.constant.js";
import Post from "./post.model.js";
import { postSearchableFields } from "./post.constant.js";
import {
  formatPostForViewer,
  formatPostsForViewer,
} from "./post.helpers.js";

const postPopulate = [
  { path: "author", select: "name email picture" },
  { path: "comments.user", select: "name email picture" },
  { path: "reactions.user", select: "name email picture" },
];

const isAdminRole = (role) =>
  role === Role.ADMIN || role === Role.SUPER_ADMIN;

const findActivePost = async (postId) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }
  return post;
};

const createPost = async (payload, authorId, imageUrls = []) => {
  const post = await Post.create({
    ...payload,
    author: authorId,
    images: imageUrls,
  });

  const populated = await Post.findById(post._id).populate(postPopulate);
  return formatPostForViewer(populated, { role: Role.USER, userId: authorId });
};

const getPosts = async (query, viewer) => {
  const baseQuery = Post.find({ isDeleted: false });
  const queryBuilder = new QueryBuilder(baseQuery, query);

  const postsQuery = queryBuilder
    .filter()
    .search(postSearchableFields)
    .sort()
    .fields()
    .paginate()
    .build()
    .populate(postPopulate);

  const [posts, meta] = await Promise.all([
    postsQuery,
    queryBuilder.getMeta(),
  ]);

  return {
    data: formatPostsForViewer(posts, viewer),
    meta,
  };
};

const getPostById = async (postId, viewer) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false }).populate(
    postPopulate,
  );

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  return formatPostForViewer(post, viewer);
};

const updatePost = async (postId, payload, decodedToken) => {
  const post = await findActivePost(postId);

  const isOwner = post.author.toString() === decodedToken.userId.toString();
  if (!isOwner && !isAdminRole(decodedToken.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  Object.assign(post, payload);
  await post.save();

  const populated = await Post.findById(post._id).populate(postPopulate);
  return formatPostForViewer(populated, decodedToken);
};

const deletePost = async (postId, decodedToken) => {
  const post = await findActivePost(postId);

  const isOwner = post.author.toString() === decodedToken.userId.toString();
  if (!isOwner && !isAdminRole(decodedToken.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  post.isDeleted = true;
  await post.save();

  return post;
};

const reactToPost = async (postId, reactionType, decodedToken) => {
  const post = await findActivePost(postId);
  const userId = decodedToken.userId;

  const existingIndex = post.reactions.findIndex(
    (item) => item.user.toString() === userId.toString(),
  );

  if (existingIndex !== -1) {
    const existing = post.reactions[existingIndex];
    if (existing.reactionType === reactionType) {
      post.reactions.splice(existingIndex, 1);
    } else {
      existing.reactionType = reactionType;
      existing.createdAt = new Date();
    }
  } else {
    post.reactions.push({ user: userId, reactionType });
  }

  await post.save();

  if (
    post.author.toString() !== userId.toString() &&
    existingIndex === -1
  ) {
    await notificationServices.createNotification({
      receiver: post.author,
      sender: userId,
      type: NotificationType.POST_REACT,
      message: "Someone reacted to your post",
    });
  }

  const populated = await Post.findById(post._id).populate(postPopulate);
  return formatPostForViewer(populated, decodedToken);
};

const addComment = async (postId, text, decodedToken) => {
  const post = await findActivePost(postId);
  const userId = decodedToken.userId;

  post.comments.push({ user: userId, text });
  await post.save();

  if (post.author.toString() !== userId.toString()) {
    await notificationServices.createNotification({
      receiver: post.author,
      sender: userId,
      type: NotificationType.POST_COMMENT,
      message: "Someone commented on your post",
    });
  }

  const populated = await Post.findById(post._id).populate(postPopulate);
  return formatPostForViewer(populated, decodedToken);
};

const deleteComment = async (postId, commentId, decodedToken) => {
  const post = await findActivePost(postId);
  const comment = post.comments.id(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const isOwner = comment.user.toString() === decodedToken.userId.toString();
  if (!isOwner && !isAdminRole(decodedToken.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  comment.deleteOne();
  await post.save();

  const populated = await Post.findById(post._id).populate(postPopulate);
  return formatPostForViewer(populated, decodedToken);
};

export const postServices = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  reactToPost,
  addComment,
  deleteComment,
};
