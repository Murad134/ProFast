// require("dotenv").config();
// const app = require("./app");

// const port = process.env.PORT || 3050;

// app.listen(port, () => {
//   console.log(`Parcel Server running on port ${port}`);
// });

// server.js

require("dotenv").config();
const app = require("./app");
const initModels = require("./utility/initModels");

const PORT = process.env.PORT || 3050;

initModels().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Parcel Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Failed to initialize models", err);
});