import mongoose, { Schema } from "mongoose";
import { ICourse } from "../interfaces/courses.interface";

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 220,
      required: true,
    },
    description: {
      type: String,
      minlength: 10,
      maxlength: 5000,
    },
    price: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: true,
      default:
        "https://info.latitudelearning.com/desktopmodules/digarticle/mediahandler.ashx?portalid=25&moduleid=4792&mediaid=706&width=800&height=350",
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalSections: {
      type: Number,
      default: 0,
    },
    totalVideos: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    learningPoints: {
      type: [String],
    },
    access_type: {
      type: String,
      enum: ["free", "paid", "prime"],
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    subTitle: { type: String, required: false },
    requirements: { type: [String], required: false },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    instructorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

CourseSchema.index({ title: 1 });
CourseSchema.index({ description: 1 });
CourseSchema.index({ categoryId: 1, price: 1 });

const courseModel = mongoose.model<ICourse>("course", CourseSchema);

export default courseModel;
