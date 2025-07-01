import Scheme from "../models/Schemes.model.js";
import NewAdvertisement from "../models/Newadvertisements.model.js";


// Create a new scheme
export const createScheme = async (req, res) => {
  try {
    const {
      schemeTitle,
      schemeTags,
      ageRange,
      districts,
      planType,
      connectionTypes,
      description,
    } = req.body;
    const scheme = new Scheme({
      schemeTitle,
      schemeTags,
      ageRange,
      districts,
      planType,
      connectionTypes,
      description,
    });
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all schemes
export const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single scheme by ID
export const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a scheme by ID
export const updateScheme = async (req, res) => {
  try {
    const {
      schemeTitle,
      schemeTags,
      ageRange,
      districts,
      planType,
      connectionTypes,
      description,
    } = req.body;
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      {
        schemeTitle,
        schemeTags,
        ageRange,
        districts,
        planType,
        connectionTypes,
        description,
      },
      { new: true }
    );
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });

    // Remove the scheme ID from all advertisements' selectedSchemeIds
    await NewAdvertisement.updateMany(
      {},
      { $pull: { selectedSchemeIds: scheme._id } }
    );

    // Remove the scheme object from selectedSchemes by _id, SchemeNo, or schemeTitle (object case)
    await NewAdvertisement.updateMany(
      {},
      {
        $pull: {
          selectedSchemes: {
            $or: [
              { _id: scheme._id },
              { SchemeNo: scheme.SchemeNo },
              { schemeTitle: scheme.schemeTitle }
            ]
          }
        }
      }
    );

    // Remove the scheme title string if present in selectedSchemes (string case)
    await NewAdvertisement.updateMany(
      {},
      { $pull: { selectedSchemes: scheme.schemeTitle } }
    );

    res.json({ message: "Scheme deleted and references removed from advertisements" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};