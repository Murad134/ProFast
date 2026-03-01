const client = require("../config/db");
const { ObjectId } = require("mongodb");
const DB_NAME = process.env.DB_NAME || "parcelsend";
const usersCollection = client.db(DB_NAME).collection("users");

const searchUsersByEmail = async (emailQuery) => {
    const regex = new RegExp(emailQuery, "i");

    return await usersCollection
        .find({ email: { $regex: regex } })
        .project({ email: 1, createdAt: 1, role: 1, last_log_in: 1 })
        .limit(10)
        .toArray();
};

const getUserByEmail = async (email) => {
    return await usersCollection.findOne({ email });
};

const createUser = async (userData) => {
    return await usersCollection.insertOne(userData);
};

// 🔄 Update last login
const updateLastLogin = async (email) => {
    return await usersCollection.updateOne(
        { email },
        { $set: { last_log_in: new Date() } }
    );
};


// 🔄 Update user role
const updateUserRole = async (id, role) => {
  return await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  );
};
module.exports = {
    searchUsersByEmail,
    getUserByEmail,
    createUser,
    updateLastLogin,
    updateUserRole,
};