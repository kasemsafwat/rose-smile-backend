import mongoose from "mongoose";

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  thumbnail: string;
  rating?: number;
  totalSections?: number;
  totalVideos?: number;
  totalDuration?: number;
  purchaseCount?: number;
  learningPoints?: string[];
  subTitle?: string;
  requirements?: string[];
  access_type: "free" | "paid" | "prime";
  level: "beginner" | "intermediate" | "advanced";
  instructorId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  url?: string;
}
