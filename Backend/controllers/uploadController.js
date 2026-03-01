// controllers/uploadController.js
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Multer + Cloudinary already uploads the file
    res.status(200).json({
      success: true,
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

module.exports = {
  uploadImage,
};