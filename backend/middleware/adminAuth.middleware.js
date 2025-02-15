import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-clicknet"];

        if (!token) {
            return res.status(401).json({ message: "You need to be logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user || user.isAdmin === false) {
            return res.status(404).json({ message: "Access denied. Admins Only!" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in admin auth middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

