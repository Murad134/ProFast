const admin = require("firebase-admin");

const verifyFBToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    
    res.status(401).send({ message: "Unauthorized" });
  }
};
module.exports = verifyFBToken;