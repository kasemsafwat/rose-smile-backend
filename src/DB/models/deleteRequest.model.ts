import mongoose, { Schema } from "mongoose";

const DeleteRequestSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["course", "section", "video"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeleteRequest", DeleteRequestSchema);
