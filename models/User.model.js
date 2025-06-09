import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Common fields
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], required: true },

  // Customer-specific fields
  customerId: { type: String, unique: true, sparse: true },
  name: { type: String, sparse: true },
  dateOfBirth: { type: Date, sparse: true }, // Shared field for both roles
  nic: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String, sparse: true },
  planType: { type: String, enum: ["Postpaid", "Prepaid"], sparse: true },
  dataUsageGB: { type: Number, sparse: true },
  voiceMinutes: { type: Number, sparse: true },
  smsUsed: { type: Number, sparse: true },
  district: { type: String, sparse: true },
  connectionType: {
    type: String,
    enum: ["3G", "4G", "5G", "Fiber"],
    sparse: true,
  },
  registrationDate: { type: Date, sparse: true },
  lastRecharge: { type: Date, sparse: true },
  monthlyBillLKR: { type: Number, sparse: true },
  languagePreference: {
    type: String,
    enum: ["Sinhala", "English", "Tamil"],
    sparse: true,
  },
  status: { type: String, enum: ["Active", "Inactive"], sparse: true },

  // Admin-specific fields
  employeeId: { type: String, unique: true, sparse: true },
  firstName: { type: String, sparse: true },
  lastName: { type: String, sparse: true },
  fullName: { type: String, sparse: true },
});

const User = mongoose.model("User", userSchema);

export default User;
