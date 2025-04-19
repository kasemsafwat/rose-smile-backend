import mongoose, { Schema } from "mongoose";
import { Isection } from "../interfaces/section.interface";

const sectionSchema = new Schema<Isection>(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "title Must be at least 3, got {VALUE}"],
      maxlength: [100, "title Must be at most 30, got {VALUE}"],
      index: 1,
    },
    desc: {
      type: String,
      required: true,
      minlength: [3, "description Must be at least 3, got {VALUE}"],
      maxlength: [700, "description Must be at most 30, got {VALUE}"],
    },
    image: {
      imageUrl: { type: String, required: true },
      id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

sectionSchema.virtual("services", {
  ref: "service",
  localField: "_id",
  foreignField: "sectionId",
});

// Ensure virtual fields are included when converting documents to JSON or Objects
sectionSchema.set("toObject", { virtuals: true });
sectionSchema.set("toJSON", { virtuals: true });

const sectionModel = mongoose.model<Isection>("section", sectionSchema);
export default sectionModel;
