const express = require("express");
const router = express.Router();
const { searchUsers, getUserRole, createOrUpdateUser, changeUserRole, checkUserExists } = require("../controllers/userController");
const verifyFBToken = require("../middleware/verifyFBToken");
const verifyAdmin = require("../middleware/verifyAdmin");

router.post("/", createOrUpdateUser);

router.get("/check", checkUserExists);

router.get("/search", verifyFBToken, verifyAdmin, searchUsers);
router.get("/role",  getUserRole);
router.patch("/:id/role", verifyFBToken, verifyAdmin, changeUserRole);

module.exports = router;


