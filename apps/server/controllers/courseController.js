import asyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

// Create course
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, instructor } = req.body;

  let thumbnailUrl = null;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    thumbnailUrl = result.secure_url;
  }

  const course = await Course.create({
    title,
    description,
    category,
    instructor,
    thumbnail: thumbnailUrl,
  });

  res.status(201).json({ success: true, course });
});

// Get all courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate("instructor", "name email");
  res.json(courses);
});

// Get single course
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("sections")
    .populate("instructor", "name");
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// Update course
export const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  course.title = title || course.title;
  course.description = description || course.description;
  course.category = category || course.category;

  await course.save();
  res.json({ success: true, course });
});

// Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  await course.deleteOne();
  res.json({ message: "Course deleted" });
});
