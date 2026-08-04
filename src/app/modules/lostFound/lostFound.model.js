import mongoose from "mongoose";
import { LostFoundStatus, LostFoundType } from "./lostFound.constant.js";

const lostFoundSchema = new mongoose.Schema(
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
      maxlength: 3000,
    },
    type: {
      type: String,
      enum: Object.values(LostFoundType),
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: 300,
    },
    contactInfo: {
      type: String,
      required: [true, "Contact information is required"],
      trim: true,
      maxlength: 300,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LostFoundStatus),
      default: LostFoundStatus.OPEN,
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

const LostFound = mongoose.model("LostFound", lostFoundSchema);

export default LostFound;
