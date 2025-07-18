import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; // Corrected path to cloudinary.js

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "advertisements", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
  },
});

const upload = multer({ storage });

export default upload;