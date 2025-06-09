import mongoose from "mongoose";

const newAdvertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  advertisementURL: { type: String, required: true },
  selectedSchemes: [{ type: mongoose.Schema.Types.Mixed }], // Array of objects or any type
  selectedSchemeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scheme" }], // Array of Scheme IDs
});

const NewAdvertisement = mongoose.model("NewAdvertisement", newAdvertisementSchema);

export default NewAdvertisement;