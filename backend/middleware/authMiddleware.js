const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);  // Log decoded JWT to check if user ID is available
        req.user = decoded; // Attach user data to the request
        next(); // Call next middleware
    } catch (error) {
        res.status(401).json({ message: "Invalid Token", error: error.message });
    }
};
