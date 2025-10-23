import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
