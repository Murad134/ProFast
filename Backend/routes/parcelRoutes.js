const express = require("express");
const router = express.Router();
const { addParcel, fetchParcels, assignRiderToParcel, getParcelById, updateParcel, removeParcel, updateParcelStatus, cashoutParcel, fetchParcelStatusCount } = require("../controllers/parcelController");
const verifyFBToken = require("../middleware/verifyFBToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyRider = require("../middleware/verifyRider");
// ➕ Create a new parcel
router.post("/", verifyFBToken, addParcel);

// 🔎 Get parcels with optional filters
router.get("/", verifyFBToken, fetchParcels);

//  🔎 Get parcel count grouped by delivery status
router.get("/delivery/status-count",verifyFBToken,fetchParcelStatusCount);
    
// 🔎 Get parcel by ID
router.get("/:id", verifyFBToken, getParcelById);

// 🔄 Update parcel by ID
router.patch("/:id", verifyFBToken, updateParcel);

// ❌ Delete parcel by ID
router.delete("/:id", verifyFBToken, removeParcel);

// ➕ Assign rider to parcel
router.patch("/:id/assign", verifyFBToken, verifyAdmin, assignRiderToParcel);

//  🔄 Update parcel delivery status
router.patch("/:id/status", verifyFBToken, verifyRider, verifyRider, updateParcelStatus);

//  🔄 Cashout parcel
router.patch("/:id/cashout", verifyFBToken, verifyRider, cashoutParcel);

module.exports = router;

