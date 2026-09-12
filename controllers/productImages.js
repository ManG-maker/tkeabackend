const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { deleteAsset } = require("../utills/cloudinary");

async function getSingleProductImages(request, response) {
  const { id } = request.params;
  const images = await prisma.image.findMany({
    where: { productID: id },
    orderBy: { sortOrder: "asc" },
  });
  if (!images) {
    return response.json({ error: "Images not found" }, { status: 404 });
  }
  return response.json(images);
}

async function createImage(request, response) {
  try {
    const { productID, image, publicId, sortOrder = 0 } = request.body;
    const createImage = await prisma.image.create({
      data: {
        productID,
        image,
        publicId: publicId || null,
        sortOrder: Number(sortOrder) || 0,
      },
    });
    return response.status(201).json(createImage);
  } catch (error) {
    console.error("Error creating image:", error);
    return response.status(500).json({ error: "Error creating image" });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params; // Getting product id from params
    const { productID, image, publicId, sortOrder = 0 } = request.body;

    // Checking whether photo exists for the given product id
    const existingImage = await prisma.image.findFirst({
      where: {
        productID: id, // Finding photo with a product id
      },
    });

    // if photo doesn't exist, return coresponding status code
    if (!existingImage) {
      return response
        .status(404)
        .json({ error: "Image not found for the provided productID" });
    }

    // Updating photo using coresponding imageID
    const updatedImage = await prisma.image.update({
      where: {
        imageID: existingImage.imageID, // Using imageID of the found existing image
      },
      data: {
        productID: productID,
        image: image,
        publicId: publicId || null,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return response.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return response.status(500).json({ error: "Error updating image" });
  }
}

async function updateSingleImage(request, response) {
  try {
    const { imageID } = request.params;
    const { sortOrder } = request.body;
    const image = await prisma.image.update({
      where: { imageID },
      data: { sortOrder: Number(sortOrder) || 0 },
    });
    return response.json(image);
  } catch (error) {
    console.error("Error updating image order:", error);
    return response.status(500).json({ error: "Error updating image order" });
  }
}

async function deleteSingleImage(request, response) {
  try {
    const { imageID } = request.params;
    const image = await prisma.image.findUnique({ where: { imageID } });
    if (!image) return response.status(404).json({ error: "Image not found" });
    await deleteAsset(image.publicId);
    await prisma.image.delete({ where: { imageID } });
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    const images = await prisma.image.findMany({
      where: {
        productID: String(id), // Converting id to string
      },
    });

    await Promise.all(images.map((image) => deleteAsset(image.publicId)));
    await prisma.image.deleteMany({
      where: { productID: String(id) },
    });
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}



module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
  updateSingleImage,
  deleteSingleImage,
};
