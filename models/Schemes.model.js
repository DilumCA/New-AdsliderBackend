import mongoose from "mongoose";

// Counter schema for auto-incrementing SchemeNo
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const schemeSchema = new mongoose.Schema({
  schemeTitle: { type: String, required: true },
  schemeTags: { type: [String], required: true },
  SchemeNo: { type: Number, unique: true },
  ageRange: {
    type: [String],
    enum: ["18-25", "26-35", "36-45", "46-60", "60+"],
    required: true,
  },
  districts: { type: [String], required: true },
  planType: {
    type: [String],
    enum: ["Prepaid", "Postpaid"],
    required: true,
  },
  connectionTypes: { type: [String], required: true },
  description: { type: String, required: false },
});

// Pre-save hook to auto-increment SchemeNo
schemeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "schemeNo" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.SchemeNo = counter.seq;
  }
  next();
});

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;