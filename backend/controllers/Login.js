import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Missing username or password" });
        }

        const user = await User.findOne({ username });

        // Plain text comparison for mock data simplicity
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};