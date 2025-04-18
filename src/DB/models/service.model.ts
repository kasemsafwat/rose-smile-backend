import mongoose, { Schema } from "mongoose";
import { Iservice } from "../interfaces/section.interface";

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
      maxlength: [7000, "description Must be at most 30, got {VALUE}"],
    },
    image: {
      type: {
        url: String,
        id: String,
      },
      required: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
  },
  { timestamps: true }
);

const serviceModel = mongoose.model<Iservice>("service", serviceSchema);
export default serviceModel;
