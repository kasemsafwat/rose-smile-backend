import mongoose from "mongoose";

// Payment Schema
export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  payment_status: "pending" | "completed" | "failed";
}
