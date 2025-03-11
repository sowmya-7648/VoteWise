const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    voterId: { type: String, required: true, unique: true },
    role: { type: String, enum: ["voter", "admin"], default: "voter" },
    isVerified: { type: Boolean, default: false },  // OTP verification status
    otp: { type: String },  // Stores OTP for email verification
    otpExpires: { type: Date }  // Expiration time for OTP
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
