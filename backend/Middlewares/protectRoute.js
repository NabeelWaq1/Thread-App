import User from "../Model/user.model.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) return res.status(401).json({ success: false, message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password')

        req.user = user;

        next();
    } catch (error) {
        console.log('error in protectRoute', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}