import { Schema, model } from "mongoose";

export const QnaCategory = {
  ACADEMIC: "ACADEMIC",
  CAMPUS_LIFE: "CAMPUS_LIFE",
  CAREER: "CAREER",
  TECHNICAL: "TECHNICAL",
  OTHER: "OTHER",
};

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

const questionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    category: {
      type: String,
      enum: Object.values(QnaCategory),
      default: QnaCategory.OTHER,
    },
    tags: { type: [String], default: [] },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isSolved: { type: Boolean, default: false, index: true },
    solvedAt: { type: Date, default: null },
    comments: { type: [commentSchema], default: [] },
    commentsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

questionSchema.index({ createdAt: -1 });

const Question = model("Question", questionSchema);
export default Question;
