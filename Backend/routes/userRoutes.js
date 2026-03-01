const express = require("express");
const router = express.Router();
const { searchUsers, getUserRole, createOrUpdateUser, changeUserRole } = require("../controllers/userController");
const verifyFBToken = require("../middleware/verifyFBToken");

router.post("/", createOrUpdateUser);
router.get("/search", searchUsers);
router.get("/:email/role", verifyFBToken, getUserRole);
router.patch("/:id/role", changeUserRole);

module.exports = router;