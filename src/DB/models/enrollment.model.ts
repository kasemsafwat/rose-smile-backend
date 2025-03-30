import mongoose, { Schema } from "mongoose";
import { IEnrollment } from "../interfaces/enrollment.interface";

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

const enrollmentModel = mongoose.model<IEnrollment>(
  "enrollment",
  EnrollmentSchema
);

export default enrollmentModel;
