import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Role } from "../user/user.model.js";
import Question from "./qNa.model.js";
 
const isAdmin = (role) => role === Role.ADMIN || role === Role.SUPER_ADMIN;
const isSameUser = (a, b) => String(a) === String(b);
 
// only expose safe public fields (never email)
const authorPopulate = { path: "author", select: "name picture" };
const commentAuthorPopulate = { path: "comments.author", select: "name picture" };
 
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 
const findActiveQuestion = async (questionId) => {
  const question = await Question.findOne({ _id: questionId, isDeleted: false });
  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }
  return question;
};
 
const buildList = async (baseFilter, query) => {
  // strip fields the client must never control
  const { searchTerm, isDeleted, comments, ...restQuery } = query;
 
  const filter = { ...baseFilter, isDeleted: false };
 
  if (searchTerm) {
    const regex = new RegExp(escapeRegex(String(searchTerm)), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }
 
  const queryBuilder = new QueryBuilder(Question.find(filter), restQuery);
  const questionsQuery = queryBuilder
    .filter()
    .sort()
    .paginate()
    .build()
    .select("-comments") // list view: count only, full comments on detail
    .populate(authorPopulate);
 
  const [data, meta] = await Promise.all([
    questionsQuery,
    queryBuilder.getMeta(),
  ]);
 
  return { data, meta };
};
 
const createQuestion = async (payload, userId) => {
  const { title, description, category, tags } = payload;

  const question = await Question.create({
    title,
    description,
    category,
    tags,
    author: userId,
  });

  return Question.findById(question._id).populate([
    authorPopulate,
    commentAuthorPopulate,
  ]);
};
 
// public
const getAllQuestions = async (query) => buildList({}, query);
 
const getMyQuestions = async (userId, query) =>
  buildList({ author: userId }, query);
 
// public
const getQuestionById = async (questionId) => {
  const question = await Question.findOne({
    _id: questionId,
    isDeleted: false,
  }).populate([authorPopulate, commentAuthorPopulate]);
 
  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }
 
  return question;
};
 
const updateQuestion = async (questionId, payload, viewer) => {
  const question = await findActiveQuestion(questionId);
 
  if (!isSameUser(question.author, viewer.userId)) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only edit your own question");
  }
 
  const { title, description, category, tags } = payload;
  if (title !== undefined) question.title = title;
  if (description !== undefined) question.description = description;
  if (category !== undefined) question.category = category;
  if (tags !== undefined) question.tags = tags;
 
  await question.save();
 
  return Question.findById(question._id).populate([
    authorPopulate,
    commentAuthorPopulate,
  ]);
};
 
const setSolvedStatus = async (questionId, isSolved, viewer) => {
  const question = await findActiveQuestion(questionId);
 
  if (!isSameUser(question.author, viewer.userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the author can change the solved status",
    );
  }
 
  question.isSolved = isSolved;
  question.solvedAt = isSolved ? new Date() : null;
  await question.save();
 
  return { _id: question._id, isSolved: question.isSolved, solvedAt: question.solvedAt };
};
 
const deleteQuestion = async (questionId, viewer) => {
  const question = await findActiveQuestion(questionId);
 
  if (!isSameUser(question.author, viewer.userId) && !isAdmin(viewer.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }
 
  question.isDeleted = true;
  await question.save();
 
  return null;
};
 
const addComment = async (questionId, content, userId) => {
  const updated = await Question.findOneAndUpdate(
    { _id: questionId, isDeleted: false },
    {
      $push: { comments: { author: userId, content } },
      $inc: { commentsCount: 1 },
    },
    { new: true },
  ).populate(commentAuthorPopulate);
 
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }
 
  return updated.comments[updated.comments.length - 1];
};
 
const deleteComment = async (questionId, commentId, viewer) => {
  const question = await findActiveQuestion(questionId);
 
  const comment = question.comments.id(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }
 
  const allowed =
    isSameUser(comment.author, viewer.userId) ||
    isSameUser(question.author, viewer.userId) ||
    isAdmin(viewer.role);
 
  if (!allowed) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }
 
  await Question.updateOne(
    { _id: questionId },
    { $pull: { comments: { _id: commentId } }, $inc: { commentsCount: -1 } },
  );
 
  return null;
};
 
export const qnaServices = {
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