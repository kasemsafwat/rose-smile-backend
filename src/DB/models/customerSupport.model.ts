import mongoose, { Schema } from "mongoose";
import { ICustomerSupport } from "../interfaces/customerSupport.interface";

const CustomerSupportSchema = new Schema<ICustomerSupport>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone:{
      type:String,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    resolution: {
      type: String,
    },
  },
  { timestamps: true }
);

const customerSupportModel = mongoose.model<ICustomerSupport>(
  "customerSupport",
  CustomerSupportSchema
);

export default customerSupportModel;
