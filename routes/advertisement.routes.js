import express from "express";
import upload from "../middleware/multer.js";
import { createAdvertisement , getPersonalizedAds , getAds,updateAd ,deleteAd} from "../controller/advertisement.controller.js"; // Corrected path

const router = express.Router();

// Route to create a new advertisement
router.post(
  "/",
  upload.fields([
    { name: "adSinhala", maxCount: 1 },
    { name: "adTamil", maxCount: 1 },
    { name: "adEnglish", maxCount: 1 },
  ]),
  createAdvertisement
);

// Route to fetch personalized ads for a user
router.get("/personalized/:userId", getPersonalizedAds);

//devin ad routes
router.get('/', getAds); // This must exist
router.put(
  "/:id",
  upload.fields([
    { name: "adSinhala", maxCount: 1 },
    { name: "adTamil", maxCount: 1 },
    { name: "adEnglish", maxCount: 1 },
  ]),
  updateAd
);
router.delete('/:id', deleteAd);

export default router;