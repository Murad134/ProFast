const express = require("express");
const router = express.Router();
const { addParcel ,fetchParcels,assignRiderToParcel,getParcelById,updateParcel,  removeParcel,updateParcelStatus,cashoutParcel,fetchParcelStatusCount} = require("../controllers/parcelController");
const verifyFBToken = require("../middleware/verifyFBToken");

// ➕ Create a new parcel
router.post("/", verifyFBToken, addParcel);

// 🔎 Get parcels with optional filters
router.get("/", fetchParcels);

//  🔎 Get parcel count grouped by delivery status
router.get("/delivery/status-count", fetchParcelStatusCount);

// 🔎 Get parcel by ID
router.get("/:id", getParcelById);

// 🔄 Update parcel by ID
router.patch("/:id", updateParcel);

// ❌ Delete parcel by ID
router.delete("/:id", removeParcel);

// ➕ Assign rider to parcel
router.patch("/:id/assign", assignRiderToParcel);

//  🔄 Update parcel delivery status
router.patch("/:id/status", updateParcelStatus);

//  🔄 Cashout parcel
router.patch("/:id/cashout", cashoutParcel);

module.exports = router;