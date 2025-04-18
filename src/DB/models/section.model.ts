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

const sectionModel = mongoose.model<Isection>("section", sectionSchema);
export default sectionModel;
