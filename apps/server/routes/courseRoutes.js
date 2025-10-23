import express from "express";
import multer from "multer";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Multer setup for thumbnails
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("thumbnail"), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
