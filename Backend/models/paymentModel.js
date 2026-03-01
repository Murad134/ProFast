// models/paymentModel.js
const { ObjectId } = require("mongodb");

let paymentsCollection;
let parcelsCollection;

const initCollections = ({ paymentsCol, parcelsCol }) => {
  paymentsCollection = paymentsCol;
  parcelsCollection = parcelsCol;
};

// Add payment record
const addPayment = async ({ parcelId, email, amount, paymentMethod, transactionId }) => {
  const paymentDoc = {
    parcelId,
    email,
    amount,
    paymentMethod,
    transactionId,
    paid_at: new Date(),
    paid_at_string: new Date().toISOString(),
  };

  const result = await paymentsCollection.insertOne(paymentDoc);
  return result;
};

// Update parcel status to Paid
const markParcelPaid = async (parcelId) => {
  const result = await parcelsCollection.updateOne(
    { _id: new ObjectId(parcelId) },
    { $set: { payment_status: "Paid" } }
  );
  return result;
};

// Fetch payments by user email
const getPaymentsByEmail = async (email) => {
  const query = { email };
  const options = { sort: { paid_at: -1 } };
  return paymentsCollection.find(query, options).toArray();
};

module.exports = {
  initCollections,
  addPayment,
  markParcelPaid,
  getPaymentsByEmail,
};