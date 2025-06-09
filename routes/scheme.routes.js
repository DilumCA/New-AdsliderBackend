import express from "express";
import {
  createScheme,
  getSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
} from "../controller/scheme.controller.js";

const router = express.Router();

router.post("/", createScheme);           // Create
router.get("/", getSchemes);              // Read all
router.get("/:id", getSchemeById);        // Read one
router.put("/:id", updateScheme);         // Update
router.delete("/:id", deleteScheme);      // Delete

export default router;