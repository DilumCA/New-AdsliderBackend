import express from "express";
import upload from "../middleware/multer.js";
import {
  createNewAdvertisement,
  getNewAdvertisements,
  getNewAdvertisementById,
  updateNewAdvertisement,
  deleteNewAdvertisement,
} from "../controller/newadvertisement.controller.js";
// import { getAdvertisementsBySchemeId } from "../controller/newadvertisement.controller.js";
import { getAdvertisementsBySchemeIds } from "../controller/newadvertisement.controller.js";

const router = express.Router();

router.post(
  "/",
  upload.single("advertisementURL"), // Accept a single file with field name 'advertisementURL'
  createNewAdvertisement
);
router.get("/", getNewAdvertisements);
router.post("/schemes", getAdvertisementsBySchemeIds);
// router.get("/scheme/:schemeId", getAdvertisementsBySchemeId);

router.get("/:id", getNewAdvertisementById);
router.put(
  "/:id",
  upload.single("advertisementURL"), // For updating the file
  updateNewAdvertisement
);
router.delete("/:id", deleteNewAdvertisement);



export default router;