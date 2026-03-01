// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createPayment, fetchPayments, createPaymentIntent } = require("../controllers/paymentController");

// Middleware to verify Firebase token
const  verifyFBToken  = require("../middleware/verifyFBToken"); // path to your middleware
// Record payment
router.post("/", verifyFBToken, createPayment);

// Get payments by user email
router.get("/", verifyFBToken, fetchPayments);

// Stripe payment intent
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;