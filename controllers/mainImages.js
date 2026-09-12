const { uploadBuffer, deleteAsset } = require("../utills/cloudinary");

async function uploadMainImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Nema otpremljenih fajlova" });
    }

    const uploadedFile = req.files.uploadedFile;

    if (!uploadedFile.mimetype?.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      return res.status(413).json({ message: "Image must be 5 MB or smaller" });
    }

    try {
      const result = await uploadBuffer(uploadedFile.data);
      return res.status(201).json({
        message: "Fajl je uspešno otpremljen",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return res.status(502).json({ message: "Image upload failed" });
    }
  }

async function deleteMainImage(req, res) {
  const { publicId } = req.body || {};
  if (!publicId) return res.status(400).json({ message: "publicId is required" });

  try {
    await deleteAsset(publicId);
    return res.status(204).send();
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    return res.status(502).json({ message: "Image delete failed" });
  }
}

  module.exports = {
    uploadMainImage,
    deleteMainImage,
};