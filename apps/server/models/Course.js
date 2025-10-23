import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    thumbnail: { type: String }, // Cloudinary URL
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
