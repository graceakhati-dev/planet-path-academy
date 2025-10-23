import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // Cloudinary URL
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lecture", lectureSchema);
