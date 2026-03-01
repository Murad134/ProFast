// initModels.js
const client = require("../config/db"); // your MongoDB client
const { initCollections: initPaymentCollections } = require("../models/paymentModel");
const initModels = async () => {
  const db = client.db("parcelsend");

  // Initialize payment model
  initPaymentCollections({
    paymentsCol: db.collection("payments"),
    parcelsCol: db.collection("parcels"), // needed for marking parcel paid
  });

  console.log("✅ All models initialized successfully");
};

module.exports = initModels;