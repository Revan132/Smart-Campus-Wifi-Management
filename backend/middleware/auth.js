import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 1. Verify Token (Login Check)
export const verifyToken = (req, res, next) => {
    try {
        // Expecting header: "Authorization: Bearer <token>"
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach payload (id, role) to request
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid Token" });
    }
};

// 2. Verify Admin (Role Check)
export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
    }
};