import mongoose from "mongoose";

export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
};

export const IsActive = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
};

const authProviderSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      minlength: 6,
      default: null,
    },
    studentId: {
      type: String,
      match: [/^\d{9}$/, "Student ID must be exactly 9 digits"],
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    phone: {
      type: String,
    },

    picture: {
      type: String,
    },

    address: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    auths: {
      type: [authProviderSchema],
      default: [
        {
          provider: "credentials",
          providerId: "",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);
userSchema.index(
  { studentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentId: { $type: "string" },
    },
  },
);

const User = mongoose.model("User", userSchema);

export default User;
