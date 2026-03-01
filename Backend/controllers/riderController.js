const { createRider,getPendingRiders, updateRiderStatusById,
  updateUserRoleIfNeeded,getActiveRiders,getAvailableRidersByDistrict,findParcelsByRiderEmail,findCompletedParcelsByRiderEmail } = require("../models/riderModel");

// ➕ Rider Registration
const registerRider = async (req, res) => {
  const rider = req.body;

  if (!rider || !rider.name || !rider.email) {
    return res.status(400).send({ message: "Rider name and email are required" });
  }

  try {
    const result = await createRider(rider);
    res.status(201).send({
      message: "Rider registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error registering rider:", error);
    res.status(500).send({ message: "Failed to register rider" });
  }
};

// 🕒 Get pending riders
const fetchPendingRiders = async (req, res) => {
  try {
    const pendingRiders = await getPendingRiders();
    res.status(200).send(pendingRiders);
  } catch (error) {
    console.error("Failed to load pending riders:", error);
    res.status(500).send({ message: "Failed to load pending riders" });
  }
};

// const changeRiderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status, email } = req.body;

//   if (!status || !email) {
//     return res.status(400).send({ message: "Status and email are required" });
//   }

//   try {
//     const result = await updateRiderStatus(id, status);

//     // If rider approved → update user role to 'rider'
//     if (status === 'active') {
//       const roleResult = await updateUserRoleIfNotAdmin(email, 'rider');

//       if (roleResult === 'skipped') {
//         console.log(`Skipped updating role for admin: ${email}`);
//       } else if (roleResult) {
//         console.log(`Updated role for user: ${email}`);
//       }
//     }

//     res.status(200).send({ message: "Rider status updated", result });
//   } catch (error) {
//     console.error("Failed to update rider status:", error);
//     res.status(500).send({ message: "Failed to update rider status" });
//   }
// };


// 🟢 Fetch active riders
const changeRiderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, email } = req.body;

  if (!status || !email) {
    return res.status(400).send({ message: "Status and email are required" });
  }

  try {
    // 1️⃣ Update rider status
    const result = await updateRiderStatusById(id, status);

    if (!result.modifiedCount) {
      return res.status(404).send({ message: "Rider not found" });
    }

    // 2️⃣ If approved → update user role
    if (status === "active") {
      await updateUserRoleIfNeeded(email);
    }

    res.status(200).send({ message: "Rider status updated successfully" });

  } catch (error) {
    console.error("Failed to update rider status:", error);
    res.status(500).send({ message: "Failed to update rider status" });
  }
};



const fetchActiveRiders = async (req, res) => {
  try {
    const result = await getActiveRiders();
    res.status(200).send(result);
  } catch (error) {
    console.error("Failed to load active riders:", error);
    res.status(500).send({ message: "Failed to load active riders" });
  }
};

// 🚚 Get available riders
const fetchAvailableRiders = async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).send({ message: "District is required" });
  }

  try {
    const riders = await getAvailableRidersByDistrict(district);
    res.status(200).send(riders);
  } catch (error) {
    console.error("Failed to load riders:", error);
    res.status(500).send({ message: "Failed to load riders" });
  }
};
const getRiderParcels = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Rider email is required" });
    }

    const parcels = await findParcelsByRiderEmail(email);
    res.status(200).json(parcels);
  } catch (err) {
    console.error("Error fetching rider parcels:", err);
    res.status(500).json({ message: "Failed to fetch rider parcels" });
  }
};
// 🔹 Fetch assigned/in-transit parcels for a rider
const fetchRiderParcels = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Rider email is required" });

    const parcels = await findParcelsByRiderEmail(email);
    res.status(200).json(parcels);
  } catch (err) {
    console.error("Error fetching rider parcels:", err);
    res.status(500).json({ message: "Failed to fetch rider parcels" });
  }
};

// 🔹 Fetch completed parcels for a rider
const fetchCompletedRiderParcels = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Rider email is required" });

    const parcels = await findCompletedParcelsByRiderEmail(email);
    res.status(200).json(parcels);
  } catch (err) {
    console.error("Error fetching completed parcels:", err);
    res.status(500).json({ message: "Failed to fetch completed parcels" });
  }
};


module.exports = {
  registerRider,
  fetchPendingRiders,
  changeRiderStatus,
  fetchActiveRiders,
  fetchAvailableRiders,
  getRiderParcels,
  fetchRiderParcels,
  fetchCompletedRiderParcels,
};