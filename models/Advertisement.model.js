import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  ageRange: { type: [String], enum: ["18-25", "26-35", "36-45", "46-60", "60+"], required: true }, // Array of strings
  districts: { type: [String], required: true }, // Array of strings
  planType: { type: [String], enum: ["Prepaid", "Postpaid"], required: true }, // Array of strings
  connectionTypes: { type: [String], required: true }, // Array of strings
  adSinhala: { type: String, required: true },
  adTamil: { type: String, required: true },
  adEnglish: { type: String, required: true },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;