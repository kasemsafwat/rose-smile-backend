import mongoose, { Schema, Types } from "mongoose";
import { Ioffer, IofferSection } from "../interfaces/offer.interface";

// offer section
const offerSectionSchema = new Schema<IofferSection>(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "title Must be at least 3, got {VALUE}"],
      maxlength: [100, "title Must be at most 30, got {VALUE}"],
    },
    desc: {
      type: String,
      required: false,
      minlength: [3, "description Must be at least 3, got {VALUE}"],
      maxlength: [700, "description Must be at most 30, got {VALUE}"],
    },
    image: {
      type: String,
      required: true,
      minlength: [10, "image Must be at least 3, got {VALUE}"],
      maxlength: [3000, "image Must be at most 30, got {VALUE}"],
    },
    offers: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
  },
  { timestamps: true }
);


// single offer 
const offerSchema = new Schema<Ioffer>(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "title Must be at least 3, got {VALUE}"],
      maxlength: [100, "title Must be at most 30, got {VALUE}"],
    },
    desc: {
      type: String,
      required: true,
      minlength: [3, "description Must be at least 3, got {VALUE}"],
      maxlength: [700, "description Must be at most 30, got {VALUE}"],
    },
    display: {
      type: Boolean,
      required: false,
      default: true,
    },
    type: {
      type: String,
      enum: ["category", "service"],
      required: true,
    },
    reference: {
      type: Schema.Types.ObjectId,
      refPath: "type",
      required: true,
    },
  },
  { timestamps: true }
);
const offerSectionModel = mongoose.model<IofferSection>(
  "offersection",
  offerSectionSchema
);

const offerModel = mongoose.model<Ioffer>("offer", offerSchema);

export { offerSectionModel, offerModel };
