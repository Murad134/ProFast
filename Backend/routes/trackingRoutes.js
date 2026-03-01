const express = require("express");
const router = express.Router();
const { fetchTrackingById, createTrackingUpdate } = require("../controllers/trackingController");

// POST new tracking update
router.post("/", createTrackingUpdate);

// GET tracking info by tracking ID
router.get("/:trackingId", fetchTrackingById);

module.exports = router;