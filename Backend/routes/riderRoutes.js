const express = require("express");
const router = express.Router();
const { registerRider, fetchPendingRiders, fetchRiderParcels, fetchCompletedRiderParcels, changeRiderStatus, fetchActiveRiders, fetchAvailableRiders, getRiderParcels } = require("../controllers/riderController");

const verifyFBToken = require("../middleware/verifyFBToken");

// ➕ Register a new rider
router.post("/", verifyFBToken, registerRider);


router.get("/parcels", fetchRiderParcels);

// 🔹 Get completed parcels
router.get("/completedparcels", fetchCompletedRiderParcels);

// 🕒 Get pending riders
router.get("/pending", verifyFBToken, fetchPendingRiders);
// ➕ Update rider status (approve/reject)
router.patch("/:id/status", verifyFBToken, changeRiderStatus);
// 🟢 Get active riders
router.get("/active", verifyFBToken, fetchActiveRiders);   // 👈 NEW
// 🟢 Get available riders by district
router.get("/available", verifyFBToken, fetchAvailableRiders);

module.exports = router;