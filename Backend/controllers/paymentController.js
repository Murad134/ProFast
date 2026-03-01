// controllers/paymentController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { addPayment, markParcelPaid, getPaymentsByEmail } = require("../models/paymentModel");

// POST /payments - Record payment and mark parcel paid
const createPayment = async (req, res) => {
    try {
        const { parcelId, email, amount, paymentMethod, transactionId } = req.body;

        // 1️⃣ Update parcel
        const updateResult = await markParcelPaid(parcelId);
        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ error: "Parcel not found or already paid" });
        }

        // 2️⃣ Add payment record
        const paymentResult = await addPayment({ parcelId, email, amount, paymentMethod, transactionId });

        res.status(201).json({
            message: "Payment recorded and parcel updated successfully",
            insertedId: paymentResult.insertedId,
        });
    } catch (err) {
        console.error("Payment error:", err);
        res.status(500).json({ error: "Failed to record payment or update parcel" });
    }
};

// GET /payments?email=...
const fetchPayments = async (req, res) => {
    try {

        // Validate token email
        if (!req.user.email || !req.user) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        const userEmail = req.query.email;

        const payments = await getPaymentsByEmail(userEmail);
        res.json(payments);
    } catch (err) {
        console.error("Fetch payments error:", err);
        res.status(500).json({ message: "Failed to fetch payments" });
    }
};

// POST /create-payment-intent
const createPaymentIntent = async (req, res) => {
    try {
        const amountInCents = req.body.amountInCents;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error("Stripe payment intent error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createPayment,
    fetchPayments,
    createPaymentIntent,
};