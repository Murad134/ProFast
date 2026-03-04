const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@parcelsend.cr3fpi2.mongodb.net/?appName=parcelsend`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function connectDB() {
  try {
    await client.connect();

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

connectDB();

module.exports = client;




// const { MongoClient, ServerApiVersion } = require("mongodb");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@parcelsend.cr3fpi2.mongodb.net/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// let isConnected = false;

// async function connectDB() {
//   if (!isConnected) {
//     await client.connect();
//     isConnected = true;
//     console.log("✅ MongoDB connected");
//   }
//   return client;
// }

// module.exports = connectDB;