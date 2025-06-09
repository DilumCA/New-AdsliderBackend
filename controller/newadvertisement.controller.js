import NewAdvertisement from "../models/Newadvertisements.model.js";

// Create a new advertisement
export const createNewAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      selectedSchemes,
      selectedSchemeIds,
    } = req.body;

    // Get the Cloudinary URL from the uploaded file
    const advertisementURL = req.file?.path;

    const newAd = new NewAdvertisement({
      title,
      description,
      startDate,
      endDate,
      advertisementURL,
      selectedSchemes,
      selectedSchemeIds,
    });

    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all advertisements
export const getNewAdvertisements = async (req, res) => {
  try {
    const ads = await NewAdvertisement.find();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single advertisement by ID
export const getNewAdvertisementById = async (req, res) => {
  try {
    const ad = await NewAdvertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an advertisement by ID
export const updateNewAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      selectedSchemes,
      selectedSchemeIds,
    } = req.body;

    // If a new file is uploaded, use its Cloudinary URL; otherwise, keep the old one
    let updateData = {
      title,
      description,
      startDate,
      endDate,
      selectedSchemes,
      selectedSchemeIds,
    };
    if (req.file?.path) {
      updateData.advertisementURL = req.file.path;
    }

    const ad = await NewAdvertisement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.json(ad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an advertisement by ID
export const deleteNewAdvertisement = async (req, res) => {
  try {
    const ad = await NewAdvertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.json({ message: "Advertisement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};