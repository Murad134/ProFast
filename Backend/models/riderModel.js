const client = require("../config/db");
const ridersCollection = client.db("parcelsend").collection("riders");
const usersCollection = client.db("parcelsend").collection("users");

// const ridersCollection = db.collection("riders");
// const usersCollection = db.collection("users");


const { ObjectId } = require("mongodb");

// ➕ Create a new rider
const createRider = async (riderData) => {
  return await ridersCollection.insertOne(riderData);
};

// 🔎 Get all pending riders
const getPendingRiders = async () => {
  return await ridersCollection.find({ status: "pending" }).toArray();
};


// 🔹 Update rider status
const updateRiderStatusById = async (id, status) => {
  return await ridersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
};

// 🔹 Update user role if not admin
const updateUserRoleIfNeeded = async (email) => {
  const user = await usersCollection.findOne({ email });

  if (!user) return;

  if (user.role === "admin") {
    console.log(`Skipped updating role for admin: ${email}`);
    return;
  }

  return await usersCollection.updateOne(
    { email },
    { $set: { role: "rider" } }
  );
};

// 🔎 Get active riders
const getActiveRiders = async () => {
  return await ridersCollection.find({ status: "active" }).toArray();
};

// 🔎 Get available riders by district
const getAvailableRidersByDistrict = async (district) => {
  return await ridersCollection
    .find({
      district,
    })
    .toArray();
};

// 🔎 Get assigned/in-transit parcels for a rider
const findParcelsByRiderEmail = async (email) => {
  const parcelsCollection = client.db("parcelsend").collection("parcels");

  const query = {
    assignedRider_email: email,
    delivery_status: { $in: ["assigned", "in_transit"] },
  };

  const options = { sort: { created_at: -1 } };

  return await parcelsCollection.find(query, options).toArray();
};

// 🔎 Get completed parcels for a rider
const findCompletedParcelsByRiderEmail = async (email) => {
  const parcelsCollection = client.db("parcelsend").collection("parcels");

  const query = {
    assignedRider_email: email,
    delivery_status: { $in: ["delivered", "service_center_delivered"] },
  };

  const options = { sort: { created_at: -1 } };

  return await parcelsCollection.find(query, options).toArray();
};

module.exports = {
  createRider,
  getPendingRiders,
  updateRiderStatusById,
  updateUserRoleIfNeeded,
  getActiveRiders,
  getAvailableRidersByDistrict,
  findParcelsByRiderEmail,           // 🔹 Added this
  findCompletedParcelsByRiderEmail,  
};