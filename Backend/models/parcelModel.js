// const {ObjectId, parcelsCollection,ridersCollection } = require("../config/db");
const client = require("../config/db");
const { ObjectId } = require("mongodb");

const dbName = process.env.DB_NAME || "parcelsend";
const parcelsCollection = client.db(dbName).collection("parcels");
const ridersCollection = client.db(dbName).collection("riders");


// const parcelsCollection = db.collection("parcels");
// const ridersCollection = db.collection("riders");

// ➕ Create Parcel
const createParcel = async (parcelData) => {
  return await parcelsCollection.insertOne(parcelData);
};

// 🔎 Get parcels with filters
const getParcels = async (query) => {
  return await parcelsCollection
    .find(query)
    .sort({ created_at: -1 })
    .toArray();
};

const findParcelById = async (id) => {
  return await parcelsCollection.findOne({
    _id: new ObjectId(id),
  });
};

const updateParcelById = async (id, updateData) => {
  return await parcelsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
};
const deleteParcelById = async (id) => {
  return await parcelsCollection.deleteOne({ _id: new ObjectId(id) });
};

// 🔄 Update rider work status
// const updateRiderWorkStatus = async (riderId, status) => {
//   return await ridersCollection.updateOne(
//     { _id: new ObjectId(riderId) },
//     { $set: { work_status: status } }
//   );
// };

// 🔄 Update parcel delivery status
const updateParcelStatusById = async (id, status) => {
  const updateDoc = {
    delivery_status: status,
    updated_at: new Date(),
  };

  if (status === "in_transit") {
    updateDoc.picked_at = new Date();
  } else if (status === "delivered") {
    updateDoc.delivered_at = new Date();
  }

  return await parcelsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateDoc }
  );
};

const cashoutParcelById = async (id) => {
  return await parcelsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        cashout_status: "cashed_out",
        cashed_out_at: new Date(),
        updated_at: new Date(),
      },
    }
  );
};
// 🔎 Get parcel count by delivery status
const getParcelStatusCount = async () => {
  const pipeline = [
    {
      $group: {
        _id: "$delivery_status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ];

  return await parcelsCollection.aggregate(pipeline).toArray();
};


const getParcelsCollection = () => client.db("parcelsend").collection("parcels");

const findParcelsByRiderEmail = async (email) => {
  const parcelsCollection = getParcelsCollection();

  const query = {
    assignedRider_email: email,
    delivery_status: { $in: ["assigned", "in_transit"] },
  };

  const options = {
    sort: { created_at: -1 },
  };

  return await parcelsCollection.find(query, options).toArray();
};

// const assignRiderToParcel = async (parcelId, riderData) => {
//   const { riderId, riderName, riderEmail } = riderData;

//   const parcelResult = await parcelsCollection.updateOne(
//     { _id: new ObjectId(parcelId) },
//     {
//       $set: {
//         assignedRider_id: riderId,
//         assignedRider_name: riderName,
//         assignedRider_email: riderEmail,
//         delivery_status: "assigned",
//       },
//     }
//   );

//   return parcelResult;
// };




// 🔹 Update parcel with rider info
const updateParcelAssignment = async (
  parcelId,
  riderId,
  riderName,
  riderEmail
) => {
  return await parcelsCollection.updateOne(
    { _id: new ObjectId(parcelId) },
    {
      $set: {
        assignedRider_id: riderId,
        assignedRider_name: riderName,
        assignedRider_email: riderEmail,
        delivery_status: "assigned"
      }
    }
  );
};

// 🔹 Update rider work status
const updateRiderWorkStatus = async (riderId) => {
  return await ridersCollection.updateOne(
    { _id: new ObjectId(riderId) },
    { $set: { work_status: "in-delivery" } }
  );
};


module.exports = {
  createParcel,
  getParcels,
  findParcelById,
  updateParcelById,
  deleteParcelById,
  updateParcelAssignment,
  updateRiderWorkStatus,
  updateParcelStatusById,
  cashoutParcelById,
  getParcelStatusCount,
  findParcelsByRiderEmail
};