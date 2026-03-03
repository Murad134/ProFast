// const express = require("express");
// const router = express.Router();
// const { registerRider, fetchPendingRiders, fetchRiderParcels, fetchCompletedRiderParcels, changeRiderStatus, fetchActiveRiders, fetchAvailableRiders, getRiderParcels } = require("../controllers/riderController");

// const verifyFBToken = require("../middleware/verifyFBToken");
// const verifyRider = require("../middleware/verifyRider");
// const verifyAdmin = require("../middleware/verifyAdmin");

// // ➕ Register a new rider
// router.post("/", registerRider);

// router.get("/parcels", fetchRiderParcels);

// // 🔹 Get completed parcels
// router.get("/completedparcels", fetchCompletedRiderParcels);
// // 🕒 Get pending riders
// router.get("/pending", fetchPendingRiders);
// // ➕ Update rider status (approve/reject)
// router.patch("/:id/status", changeRiderStatus);
// // 🟢 Get active riders
// router.get("/active", fetchActiveRiders);   // 👈 NEW
// // 🟢 Get available riders by district
// router.get("/available", fetchAvailableRiders);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
    registerRider,
    fetchPendingRiders,
    fetchRiderParcels,
    fetchCompletedRiderParcels,
    changeRiderStatus,
    fetchActiveRiders,
    fetchAvailableRiders,
} = require("../controllers/riderController");

const verifyFBToken = require("../middleware/verifyFBToken");
const verifyRider = require("../middleware/verifyRider");
const verifyAdmin = require("../middleware/verifyAdmin");


// ➕ Register a new rider (only logged-in users can apply)
router.post("/", registerRider);


// 🛵 Rider Routes (ONLY riders)

// Get assigned parcels (pending deliveries)
router.get("/parcels", verifyFBToken, verifyRider, fetchRiderParcels);

// Get completed parcels
router.get(
    "/completedparcels",
    verifyFBToken,
    fetchCompletedRiderParcels
);

// 👑 Admin Routes (ONLY admin)
// Get pending rider applications
router.get("/pending", fetchPendingRiders);

// Approve / Reject rider
router.patch(
    "/:id/status",
    verifyFBToken,
    changeRiderStatus
);
// Get active riders
router.get("/active", verifyFBToken, verifyAdmin, fetchActiveRiders);

// Get available riders (for assigning parcels)
router.get("/available", verifyFBToken,verifyAdmin ,fetchAvailableRiders);
module.exports = router;