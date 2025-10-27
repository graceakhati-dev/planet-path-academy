import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Course from "../models/Course.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.price === 0)
      return res.status(400).json({ message: "Course is free. Enroll directly." });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: course.title },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
    });

    const order = new Order({
      user: req.user.id,
      course: courseId,
      amount: course.price,
      stripeSessionId: session.id,
    });
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment session failed", error });
  }
};


// 🆓 Free Course Enrollment (no Stripe payment)
export const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if the course is free
    if (course.price > 0)
      return res.status(400).json({ message: "This course is not free" });

    // Check if already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses?.includes(courseId))
      return res.status(400).json({ message: "Already enrolled in this course" });

    // Enroll the user
    user.enrolledCourses = user.enrolledCourses || [];
    user.enrolledCourses.push(courseId);
    await user.save();

    // Optionally, increase enrolled count on course
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    await course.save();

    // Create an order record with paymentStatus="free"
    const order = new Order({
      user: userId,
      course: courseId,
      amount: 0,
      paymentStatus: "paid",
    });
    await order.save();

    res.status(200).json({
      message: "✅ Enrolled successfully in free course",
      courseId,
    });
  } catch (error) {
    console.error("Free enrollment failed:", error);
    res.status(500).json({ message: "Enrollment failed", error });
  }
};
