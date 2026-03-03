// const admin = require("firebase-admin");
// const serviceAccount = require("../firebase-admin_key.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;

require("dotenv").config();
const admin = require("firebase-admin");
const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decodedKey);
// const serviceAccount = require("../firebase-admin_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;