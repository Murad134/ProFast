
const { ObjectId } = require("mongodb");
const { createParcel, getParcels, findParcelById, updateParcelById, deleteParcelById,updateParcelAssignment,
  updateRiderWorkStatus, updateParcelStatusById, cashoutParcelById, getParcelStatusCount } = require("../models/parcelModel");

// 📦 Create Parcel
const addParcel = async (req, res) => {
    try {
        const parcel = {
            ...req.body,
            created_by: req.user && req.user.email ? req.user.email : 'anonymous', // 🔐 secure fallback
            created_at: new Date(),
            payment_status: 'Pending',
            delivery_status: 'Pending',
        };

        const result = await createParcel(parcel);

        res.send({
            success: true,
            insertedId: result.insertedId,
        });
    } catch (error) {
        console.error('Create parcel error:', error);
        res.status(500).send({ error: 'Failed to create parcel' });
    }
};

// 📦 Fetch Parcels (with filters)
const fetchParcels = async (req, res) => {
    try {
        const { email, payment_status, delivery_status } = req.query;
        const query = {};

        // optional filter by user
        if (email) {
          query.created_by = email;
        }

        // optional payment status
        if (payment_status) {
          query.payment_status = {
            $regex: new RegExp(`^${payment_status}$`, 'i'),
          };
        }

        // optional delivery status
        if (delivery_status) {
          query.delivery_status = {
            $regex: new RegExp(`^${delivery_status}$`, 'i'),
          };
        }
                // use model helper to fetch parcels
                const parcels = await getParcels(query);

                res.send(parcels);
      } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).send({ error: 'Failed to fetch parcels' });
      }
};

const getParcelById = async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({
            success: false,
            message: "Invalid parcel ID",
        });
    }

    try {
        const parcel = await findParcelById(id);

        if (!parcel) {
            return res.status(404).send({
                success: false,
                message: "Parcel not found",
            });
        }

        return res.status(200).send({
            success: true,
            data: parcel,
        });
    } catch (error) {
        console.error("Get parcel by id error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const updateParcel = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid parcel ID" });
    }

    const updateData = { ...req.body };
    delete updateData.created_by;
    delete updateData.created_at;
    updateData.updated_at = new Date();

    try {
        const result = await updateParcelById(id, updateData);
        res.status(200).send(result);
    } catch (error) {
        console.error("Failed to update parcel:", error);
        res.status(500).send({ message: "Failed to update parcel" });
    }
};


const removeParcel = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid parcel ID" });
    }

    try {
        const result = await deleteParcelById(id);

        if (result.deletedCount === 1) {
            res.status(200).json({
                success: true,
                message: "Parcel deleted",
                deletedCount: result.deletedCount,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Parcel not found",
                deletedCount: 0,
            });
        }
    } catch (error) {
        console.error("Failed to delete parcel:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// const assignRider = async (req, res) => {
//     const { id } = req.params;
//     const { riderId, riderName, riderEmail } = req.body;

//     if (!id || !riderId || !riderName || !riderEmail) {
//         return res.status(400).send({ message: "Parcel ID and rider info required" });
//     }

//     try {
//         // 1️⃣ Update parcel assignment
//         const parcelResult = await assignRiderToParcel(id, { riderId, riderName, riderEmail });

//         if (parcelResult.matchedCount === 0) {
//             return res.status(404).send({ message: "Parcel not found" });
//         }

//         // 2️⃣ Update rider work status
//         const riderResult = await updateRiderWorkStatus(riderId, "in-delivery");

//         if (riderResult.matchedCount === 0) {
//             return res.status(404).send({ message: "Rider not found" });
//         }

//         res.status(200).send({
//             success: true,
//             message: "Rider assigned and status updated successfully",
//         });
//     } catch (error) {
//         console.error("Assignment failed:", error);
//         res.status(500).send({ message: "Assignment failed" });
//     }
// };
// 🔄 Update parcel delivery status
const updateParcelStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
        return res.status(400).send({ message: "Parcel ID and status are required" });
    }

    try {
        const result = await updateParcelStatusById(id, status);

        if (result.matchedCount === 0) {
            return res.status(404).send({ success: false, message: "Parcel not found" });
        }

        res.status(200).send({
            success: true,
            modifiedCount: result.modifiedCount,
            message: "Parcel status updated successfully",
        });
    } catch (err) {
        console.error("Failed to update parcel status:", err);
        res.status(500).send({
            success: false,
            message: "Failed to update parcel status",
        });
    }
};

const cashoutParcel = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: "Parcel ID is required" });
    }

    try {
        const result = await cashoutParcelById(id);

        if (result.matchedCount === 0) {
            return res.status(404).send({ success: false, message: "Parcel not found" });
        }

        res.status(200).send({
            success: true,
            modifiedCount: result.modifiedCount,
            message: "Parcel cashed out successfully",
        });
    } catch (err) {
        console.error("Failed to cashout parcel:", err);
        res.status(500).send({
            success: false,
            message: "Failed to cashout parcel",
        });
    }
};
// 🔎 Get parcel count grouped by delivery status
const fetchParcelStatusCount = async (req, res) => {
    try {
        const result = await getParcelStatusCount();
        res.status(200).send(result);
    } catch (error) {
        console.error("Failed to fetch parcel status count:", error);
        res.status(500).send({
            success: false,
            message: "Failed to fetch parcel status count",
        });
    }
};


const assignRiderToParcel = async (req, res) => {
  const { id } = req.params;
  const { riderId, riderName, riderEmail } = req.body;

  if (!riderId || !riderName || !riderEmail) {
    return res.status(400).send({
      message: "Rider information is required"
    });
  }

  try {
    // 1️⃣ Update parcel
    const parcelResult = await updateParcelAssignment(
      id,
      riderId,
      riderName,
      riderEmail
    );

    if (!parcelResult.matchedCount) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    // 2️⃣ Update rider work status
    const riderResult = await updateRiderWorkStatus(riderId);

    if (!riderResult.matchedCount) {
      return res.status(404).send({ message: "Rider not found" });
    }

    res.status(200).send({
      success: true,
      message: "Rider assigned and status updated successfully"
    });

  } catch (error) {
    console.error("Assignment failed:", error);
    res.status(500).send({ message: "Assignment failed" });
  }
};



// 🔎 Fetch parcels for a specific rider
// const fetchRiderParcels = async (req, res) => {
//     try {
//         const email = req.query.email;
//         if (!email) {
//             return res.status(400).send({ message: "Rider email is required" });
//         }

//         const parcels = await getParcelsForRider(email);

//         res.status(200).send(parcels);
//     } catch (err) {
//         console.error("Failed to fetch rider parcels:", err);
//         res.status(500).send({ message: "Failed to fetch rider parcels" });
//     }
// };

// 🔎 Fetch completed parcels for a rider
// const fetchCompletedRiderParcels = async (req, res) => {
//     try {
//         const email = req.query.email;

//         if (!email) {
//             return res.status(400).send({ message: "Rider email is required" });
//         }

//         const completedParcels = await getCompletedParcelsForRider(email);

//         res.status(200).send(completedParcels);
//     } catch (err) {
//         console.error("Failed to fetch completed parcels:", err);
//         res.status(500).send({ message: "Failed to load completed deliveries" });
//     }
// };
module.exports = {
    addParcel,
    fetchParcels,
    getParcelById,
    updateParcel,
    removeParcel,
    updateParcelStatus,
    cashoutParcel,
    fetchParcelStatusCount,
    assignRiderToParcel,
};