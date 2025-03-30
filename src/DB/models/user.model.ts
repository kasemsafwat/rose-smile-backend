import mongoose, { Schema } from "mongoose";
import { Iuser, Roles } from "../interfaces/user.interface";

const userSchema = new Schema<Iuser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "firstName Must be at least 3, got {VALUE}"],
      maxlength: [30, "firstName Must be at most 30, got {VALUE}"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "last Name Must be at least 3, got {VALUE}"],
      maxlength: [30, "last Name Must be at most 30, got {VALUE}"],
    },
    email: {
      type: String,
      required: true,
      minlength: [6, "email Must be at least 6, got {VALUE}"],
      maxlength: [30, "email Must be at most 30, got {VALUE}"],
      unique: true,
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
    age: {
      type: Number,
      required: false,
      min: [5, "Age must be at least 5 years old"],
      max: [100, "Age must be at most 100 years old"],
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      required: true,
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
    isOnline:{
      type: Boolean,
      default: false
    },
    code:{
      type: String,
    },
    jobTitle:{
      type: String,
    },
    avatar: {
      type: String,
      required: false,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    frontId: {
      type: String,
    },
    backId: {
      type: String,
    },
    requiredVideo: {
      type: String,
    },
    optionalVideo: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "none"],
    },
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      portfolio: { type: String }
    }
  },
  { timestamps: true }
);

userSchema.virtual('courses', {
  ref: 'course',
  localField: '_id',
  foreignField: 'instructorId',
});

// Ensure virtual fields are included when converting documents to JSON or Objects
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const userModel = mongoose.model<Iuser>("user", userSchema);
export default userModel;
