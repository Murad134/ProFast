const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const { upload } = require("../config/cloudinary"); // Multer + Cloudinary config

// POST image upload
router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;