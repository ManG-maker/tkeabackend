const { v2: cloudinary } = require("cloudinary");

cloudinary.config({ secure: true });

function assertConfigured() {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL environment variable is required");
  }
}

function uploadBuffer(buffer, options = {}) {
  assertConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tkea237/products",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

async function deleteAsset(publicId) {
  if (!publicId || !process.env.CLOUDINARY_URL) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

module.exports = { uploadBuffer, deleteAsset };