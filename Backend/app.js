const express = require("express");
const cors = require("cors");
require("./config/db"); // connect DB
require("./config/firebase"); // initialize firebase

const userRoutes = require("./routes/userRoutes");
const riderRoutes = require("./routes/riderRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/rider", riderRoutes);
app.use("/users", userRoutes);
app.use("/parcels", parcelRoutes);
app.use("/payments", paymentRoutes);
app.use("/tracking", trackingRoutes);
app.use("/api", uploadRoutes); // optional prefix

app.get("/", (req, res) => {
  res.send("Parcel Server Running (MVC)");
});
module.exports = app;