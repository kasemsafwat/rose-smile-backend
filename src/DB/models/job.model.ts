import mongoose, { Schema } from "mongoose";
import { IJob } from "../interfaces/job.interface";

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const jobModel = mongoose.model<IJob>("job", JobSchema);

export default jobModel;
