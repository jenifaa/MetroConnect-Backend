import mongoose from "mongoose";
import { ComplaintCategory, ComplaintStatus } from "./complain.constant.js";

const complainSchema = new mongoose.Schema(
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
      enum: Object.values(ComplaintCategory),
      default: ComplaintCategory.OTHER,
    },
    status: {
      type: String,
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.PENDING,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
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

const Complain = mongoose.model("Complain", complainSchema);

export default Complain;
