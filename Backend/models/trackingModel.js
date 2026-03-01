// const { trackingCollection } = require("../config/db");
const client = require("../config/db");

const db = client.db("parcelDB");
const trackingCollection = db.collection("tracking");
// ➕ Add a new tracking update
const addTrackingUpdate = async (updateData) => {
  updateData.createdAt = new Date();
  return await trackingCollection.insertOne(updateData);
};

// 🔎 Get tracking events by tracking ID
const getTrackingById = async (trackingId) => {
  return await trackingCollection
    .find({ tracking_id: trackingId })
    .sort({ createdAt: 1 })
    .toArray();
};

module.exports = {
  getTrackingById,
    addTrackingUpdate,
};