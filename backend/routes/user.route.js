const express = require("express");
const { registerUser, verifyOTP, loginUser, verifyLoginOTP, getUserProfile } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure correct path

const router = express.Router();

// User registration & OTP verification
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);

// Login with OTP
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP);

// Protected profile route
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
