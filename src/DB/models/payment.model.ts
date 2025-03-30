import mongoose, { Schema } from "mongoose";
import { IPayment } from "../interfaces/payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model<IPayment>("payment", PaymentSchema);

export default paymentModel;
