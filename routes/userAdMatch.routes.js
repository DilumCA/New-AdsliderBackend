import express from "express";
import { getRelevantAdsForUser } from "../controller/userAdMatch.controller.js";

const router = express.Router();

router.get("/user/:userId/advertisements", getRelevantAdsForUser);

export default router;
// This route will handle requests to get relevant advertisements for a specific user
// based on their profile and the advertisements' scheme tags.