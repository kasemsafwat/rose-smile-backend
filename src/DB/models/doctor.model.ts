import mongoose, { Schema } from "mongoose";
import { Idoctor } from "../interfaces/doctor.interface";

const DoctorSchema = new Schema<Idoctor>(
  {
    name: { type: String, required: true },
    phone_whatsapp: { type: String, required: true },
    image: { type: String, required: true },
    specification: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const doctorModel = mongoose.model<Idoctor>("doctor", DoctorSchema);
