import express from "express";
import User from "../models/User.model.js";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if the provided password matches the stored password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Prepare the response data based on the user's role
    let responseData = {
      _id: user._id, // Include the ObjectId in the response
      username: user.username,
      role: user.role,
    };

    if (user.role === "customer") {
      responseData = {
        ...responseData,
        customerId: user.customerId,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        nic: user.nic,
        phoneNumber: user.phoneNumber,
        planType: user.planType,
        dataUsageGB: user.dataUsageGB,
        voiceMinutes: user.voiceMinutes,
        smsUsed: user.smsUsed,
        district: user.district,
        connectionType: user.connectionType,
        registrationDate: user.registrationDate,
        lastRecharge: user.lastRecharge,
        monthlyBillLKR: user.monthlyBillLKR,
        languagePreference: user.languagePreference,
        status: user.status,
      };
    }

    // Send the response
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;