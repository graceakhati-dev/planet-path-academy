import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

// Stripe checkout session route
router.post("/create-checkout-session", protect, createCheckoutSession);

export default router;
