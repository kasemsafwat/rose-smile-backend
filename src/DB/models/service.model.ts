import mongoose, { Schema } from "mongoose";
import { Iservice } from "../interfaces/category.interface";

const serviceSchema = new Schema<Iservice>(
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
    images: {
      type: [String],
      required: true,
      minlength: [10, "images Must be at least 3, got {VALUE}"],
      maxlength: [3000, "images Must be at most 30, got {VALUE}"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true }
);

const serviceModel = mongoose.model<Iservice>("service", serviceSchema);
export default serviceModel;
