import mongoose from "mongoose";

// Enrollment Schema
export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
}
