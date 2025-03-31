import mongoose, { Schema } from "mongoose";
import { Icategory } from "../interfaces/category.interface";

const categorySchema = new Schema<Icategory>(
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
      type: String,
      required: true,
      minlength: [10, "image Must be at least 3, got {VALUE}"],
      maxlength: [3000, "image Must be at most 30, got {VALUE}"],
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model<Icategory>("category", categorySchema);
export default categoryModel;
