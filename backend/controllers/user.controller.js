const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate a secure OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Hash OTP before storing it
const hashOTP = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};

// Compare OTP
const verifyHashedOTP = async (enteredOTP, storedOTP) => {
    return bcrypt.compare(enteredOTP, storedOTP);
};

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

// 📌 **Register User**
const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, voterId, role } = req.body;

        if (age < 18) return res.status(400).json({ message: "You must be at least 18 years old." });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered." });

        const existingVoter = await User.findOne({ voterId });
        if (existingVoter) return res.status(400).json({ message: "Voter ID already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);

        const user = new User({
            name, email, password: hashedPassword, age, voterId, role,
            otp: hashedOTP, otpExpires: Date.now() + 5 * 60 * 1000 // OTP valid for 5 minutes
        });
        await user.save();

        // Send OTP via Email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP: ${otp}`
        });

        res.status(201).json({ message: "User registered. Verify OTP to activate account." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📌 **Verify OTP for Registration**
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const isValidOTP = await verifyHashedOTP(otp, user.otp);
        if (!isValidOTP) return res.status(400).json({ message: "Invalid OTP." });

        // Update user verification status and remove OTP fields
        await User.updateOne({ email }, {
            $set: { isVerified: true },
            $unset: { otp: "", otpExpires: "" }
        });

        res.status(200).json({ message: "Account verified successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📌 **Login User & Send OTP**
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found." });

        if (!user.isVerified) return res.status(400).json({ message: "Account not verified. Please register again." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        // Prevent OTP spamming (Rate Limiting)
        if (user.otpExpires && user.otpExpires > Date.now()) {
            return res.status(400).json({ message: "Please wait before requesting another OTP." });
        }

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

        // Update OTP in the database
        await User.updateOne({ email }, { $set: { otp: hashedOTP, otpExpires } });

        // Send OTP via Email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Login OTP Verification",
            text: `Your OTP for login: ${otp}`
        });

        res.status(200).json({ message: "OTP sent to your email." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📌 **Verify OTP After Login & Generate JWT*
const verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const isValidOTP = await verifyHashedOTP(otp, user.otp);
        if (!isValidOTP) return res.status(400).json({ message: "Invalid OTP." });

        // OTP is valid, clear OTP fields
        await User.updateOne({ email }, { $unset: { otp: "", otpExpires: "" } });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "OTP Verified. Login Successful!", token });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 📌 **Get User Profile**
const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token, authorization denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
const getUser = async (req, res) => {
    console.log("User from JWT Middleware:", req.user);  // Debugging log

    try {
        if (!req.user || !req.user.userId) {  // 🛠️ Change `id` to `userId`
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user: user,
        });
    } catch (error) {
        console.error("Error in getUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = { registerUser, loginUser, verifyOTP, verifyLoginOTP, getUserProfile, getUser }