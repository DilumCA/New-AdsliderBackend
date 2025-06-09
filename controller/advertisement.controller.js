import Advertisement from "../models/Advertisement.model.js";
import User from "../models/User.model.js";


export const createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      ageRange,
      districts,
      planType,
      connectionTypes,
    } = req.body;

    // Cloudinary URLs for uploaded advertisements
    const adSinhala = req.files?.adSinhala?.[0]?.path || null;
    const adTamil = req.files?.adTamil?.[0]?.path || null;
    const adEnglish = req.files?.adEnglish?.[0]?.path || null;

    // Create a new advertisement document
    const advertisement = new Advertisement({
      title,
      description,
      startDate,
      endDate,
      ageRange: JSON.parse(ageRange), // Parse JSON string to array
      districts: JSON.parse(districts), // Parse JSON string to array
      planType: JSON.parse(planType), // Parse JSON string to array
      connectionTypes: JSON.parse(connectionTypes), // Parse JSON string to array
      adSinhala,
      adTamil,
      adEnglish,
    });

    // Save to the database
    await advertisement.save();
    res.status(201).json({ message: "Advertisement created successfully!" });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({ error: "Failed to create advertisement" });
  }
};

export const getPersonalizedAds = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the logged-in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate user's age range
    const userAgeRange = user.dateOfBirth ? calculateAgeRange(user.dateOfBirth) : undefined;

    // Fetch advertisements that match the user's attributes
    const ads = await Advertisement.find({
      startDate: { $lte: new Date() }, // Ad is active (startDate <= today)
      endDate: { $gte: new Date() },   // Ad is active (endDate >= today)
      ageRange: userAgeRange,          // Match user's age range
      districts: { $in: [user.district] }, // Match user's district
      planType: { $in: [user.planType] }, // Match user's plan type
      connectionTypes: { $in: [user.connectionType] }, // Match user's connection type
    });

    // Extract ad titles and URLs based on the user's language preference
    const adData = ads.map((ad) => {
      let url = null;
      if (user.languagePreference === "Sinhala") url = ad.adSinhala;
      if (user.languagePreference === "Tamil") url = ad.adTamil;
      if (user.languagePreference === "English") url = ad.adEnglish;

      return url ? { title: ad.title, url } : null; // Include title and URL
    }).filter((ad) => ad !== null); // Remove null values

    res.status(200).json(adData);
  } catch (error) {
    console.error("Error fetching personalized ads:", error);
    res.status(500).json({ message: "Failed to fetch personalized ads" });
  }
};

// Helper function to calculate age range based on date of birth
const calculateAgeRange = (dateOfBirth) => {
  const age = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age >= 18 && age <= 25) return "18-25";
  if (age >= 26 && age <= 35) return "26-35";
  if (age >= 36 && age <= 45) return "36-45";
  if (age >= 46 && age <= 60) return "46-60";
  if (age > 60) return "60+";
  return undefined;
};

//-------------------------------------------------------------------------------------------------------------
//devins adcontroller
export const getAds = async (req, res) => {
  try {
    const ads = await Advertisement.find({});
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get advertisement by ID
export const getAdById = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (ad) {
      res.json(ad);
    } else {
      res.status(404).json({ message: "Ad not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update advertisement
export const updateAd = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (ad) {
      ad.title = req.body.title || ad.title;
      ad.description = req.body.description || ad.description;
      ad.startDate = req.body.startDate || ad.startDate;
      ad.endDate = req.body.endDate || ad.endDate;
      ad.ageRange = req.body.ageRange ? JSON.parse(req.body.ageRange) : ad.ageRange; // Parse JSON string
      ad.districts = req.body.districts ? JSON.parse(req.body.districts) : ad.districts; // Parse JSON string
      ad.planType = req.body.planType ? JSON.parse(req.body.planType) : ad.planType; // Parse JSON string
      ad.connectionTypes = req.body.connectionTypes
        ? JSON.parse(req.body.connectionTypes)
        : ad.connectionTypes; // Parse JSON string

      // Handle file uploads
      if (req.files?.adSinhala?.[0]?.path) {
        ad.adSinhala = req.files.adSinhala[0].path;
      }
      if (req.files?.adTamil?.[0]?.path) {
        ad.adTamil = req.files.adTamil[0].path;
      }
      if (req.files?.adEnglish?.[0]?.path) {
        ad.adEnglish = req.files.adEnglish[0].path;
      }

      const updatedAd = await ad.save();
      res.json(updatedAd);
    } else {
      res.status(404).json({ message: "Ad not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete advertisement
export const deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (ad) {
      res.json({ message: "Ad removed" });
    } else {
      res.status(404).json({ message: "Ad not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};