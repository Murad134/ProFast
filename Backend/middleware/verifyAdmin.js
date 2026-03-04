
// const { usersCollection } = require('../models/userModel');

const client = require('../config/db');
const usersCollection = client.db("parcelsend").collection("users");


const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await usersCollection.findOne({ email });
    if (!user || user.role !== 'admin') return res.status(403).send({ message: 'forbidden access' });
    next();
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error', err });
  }
};

module.exports = verifyAdmin;




// const connectDB = require("../config/db");

// const verifyAdmin = async (req, res, next) => {
//   try {
//     const email = req.user.email;

//     // ✅ Always get a connected client
//     const client = await connectDB();
//     const usersCollection = client.db("parcelsend").collection("users");

//     const user = await usersCollection.findOne({ email });

//     if (!user || user.role !== "admin") {
//       return res.status(403).send({ message: "Forbidden access" });
//     }

//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Internal Server Error", err });
//   }
// };

// module.exports = verifyAdmin;