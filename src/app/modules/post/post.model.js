import mongoose from "mongoose";
import { PostCategory, ReactionType } from "./post.constant.js";

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactionType: {
      type: String,
      enum: Object.values(ReactionType),
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true,
  },
);

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true,
  },
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: Object.values(PostCategory),
      default: PostCategory.GENERAL,
    },
    images: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({ title: "text", description: "text" });

const Post = mongoose.model("Post", postSchema);

export default Post;
