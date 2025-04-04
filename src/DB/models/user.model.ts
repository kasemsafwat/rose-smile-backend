import mongoose, { Schema } from "mongoose";
import { Iuser, Roles } from "../interfaces/user.interface";

const userSchema = new Schema<Iuser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "firstName Must be at least 3, got {VALUE}"],
      maxlength: [30, "firstName Must be at most 30, got {VALUE}"],
      index: 1,
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "last Name Must be at least 3, got {VALUE}"],
      maxlength: [30, "last Name Must be at most 30, got {VALUE}"],
      index: 1,
    },
    email: {
      type: String,
      required: true,
      minlength: [6, "email Must be at least 6, got {VALUE}"],
      maxlength: [30, "email Must be at most 30, got {VALUE}"],
      unique: true,
      index: 1,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.User,
    },
    phone: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      required: false,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: false,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model<Iuser>("user", userSchema);
export default userModel;
