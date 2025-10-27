import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  loginUser
);

export default router;
