import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Role } from "../user/user.model.js";
import LostFound from "./lostFound.model.js";
import { lostFoundSearchableFields } from "./lostFound.constant.js";

const lostFoundPopulate = {
  path: "createdBy",
  select: "name email picture",
};

const isAdminRole = (role) =>
  role === Role.ADMIN || role === Role.SUPER_ADMIN;

const createLostFound = async (payload, userId, imageUrl = "") => {
  const item = await LostFound.create({
    ...payload,
    createdBy: userId,
    image: imageUrl,
  });

  return LostFound.findById(item._id).populate(lostFoundPopulate);
};

const getLostFoundItems = async (query) => {
  const baseQuery = LostFound.find({ isDeleted: false });
  const queryBuilder = new QueryBuilder(baseQuery, query);

  const itemsQuery = queryBuilder
    .filter()
    .search(lostFoundSearchableFields)
    .sort()
    .paginate()
    .build()
    .populate(lostFoundPopulate);

  const [data, meta] = await Promise.all([itemsQuery, queryBuilder.getMeta()]);

  return { data, meta };
};

const getLostFoundById = async (id) => {
  const item = await LostFound.findOne({
    _id: id,
    isDeleted: false,
  }).populate(lostFoundPopulate);

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Lost/Found item not found");
  }

  return item;
};

const updateLostFound = async (id, payload, decodedToken) => {
  const item = await LostFound.findOne({ _id: id, isDeleted: false });

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Lost/Found item not found");
  }

  const isOwner = item.createdBy.toString() === decodedToken.userId.toString();
  if (!isOwner && !isAdminRole(decodedToken.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.status && !isAdminRole(decodedToken.role) && !isOwner) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  Object.assign(item, payload);
  await item.save();

  return LostFound.findById(item._id).populate(lostFoundPopulate);
};

const deleteLostFound = async (id, decodedToken) => {
  const item = await LostFound.findOne({ _id: id, isDeleted: false });

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Lost/Found item not found");
  }

  const isOwner = item.createdBy.toString() === decodedToken.userId.toString();
  if (!isOwner && !isAdminRole(decodedToken.role)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  item.isDeleted = true;
  await item.save();

  return item;
};

export const lostFoundServices = {
  createLostFound,
  getLostFoundItems,
  getLostFoundById,
  updateLostFound,
  deleteLostFound,
};
