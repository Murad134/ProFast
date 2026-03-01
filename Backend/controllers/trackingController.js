const { addTrackingUpdate, getTrackingById } = require("../models/trackingModel");

// 🔎 Fetch tracking info by tracking ID
const fetchTrackingById = async (req, res) => {
  try {
    const trackingId = req.params.trackingId;

    if (!trackingId) {
      return res.status(400).send({ message: "Tracking ID is required" });
    }

    const data = await getTrackingById(trackingId);
    res.status(200).send(data);
  } catch (err) {
    console.error("Failed to fetch tracking info:", err);
    res.status(500).send({ message: "Failed to fetch tracking" });
  }
};
const createTrackingUpdate = async (req, res) => {
  try {
    const update = req.body;

    if (!update.tracking_id || !update.status) {
      return res
        .status(400)
        .json({ message: "tracking_id and status are required" });
    }

    const result = await addTrackingUpdate(update);
    res.status(201).json(result);
  } catch (err) {
    console.error("Failed to add tracking update:", err);
    res.status(500).json({ message: "Failed to add tracking update" });
  }
};


module.exports = {
  fetchTrackingById,
    createTrackingUpdate,
};